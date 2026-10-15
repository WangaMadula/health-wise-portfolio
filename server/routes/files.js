const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PatientFile = require('../models/PatientFile');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common document and image types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and documents are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Upload file (handle multer errors explicitly)
router.post('/upload', auth, (req, res, next) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      // Multer error or custom fileFilter error
      console.error('Multer error during upload:', err.message);
      // Provide clear client-friendly error messages
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ message: err.message || 'File upload error' });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Upload attempt - user:', req.user?.email, 'file:', req.file?.originalname);

    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }


    // Collect all form fields
    const {
      fileType,
      description,
      firstName,
      lastName,
      idNumber,
      dateOfBirth,
      email,
      phone,
      address,
      medicalAidName,
      medicalAidNumber,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation
    } = req.body;
    console.log('File metadata - type:', fileType, 'desc:', description);

    const patientFile = new PatientFile({
      patient: req.user._id,
      // Personal Info
      firstName,
      lastName,
      idNumber,
      dateOfBirth,
      email,
      phone,
      address,
      // Medical Aid
      medicalAidName,
      medicalAidNumber,
      // Emergency Contact
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      // File Info
      fileType: fileType || 'other',
      fileName: req.file.originalname,
      filePath: req.file.path,
      description,
      uploadedBy: req.user._id,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    await patientFile.save();
    console.log('File saved to DB:', patientFile._id);

    res.status(201).json({
      message: 'File uploaded successfully',
      file: patientFile
    });
  } catch (error) {
    // Delete uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkErr) { console.error('Failed to remove file after error:', unlinkErr); }
    }
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during file upload', error: error.message });
  }
});

// Get user's files
router.get('/my-files', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, fileType } = req.query;
    const query = { patient: req.user._id };

    if (fileType && fileType !== 'all') {
      query.fileType = fileType;
    }

    const files = await PatientFile.find(query)
      .populate('reviewedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await PatientFile.countDocuments(query);

    res.json({
      files,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all files (admin only)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, fileType, patientId } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (fileType && fileType !== 'all') {
      query.fileType = fileType;
    }

    if (patientId) {
      query.patient = patientId;
    }

    const files = await PatientFile.find(query)
      .populate('patient', 'name email')
      .populate('reviewedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await PatientFile.countDocuments(query);

    res.json({
      files,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Review file (admin only)
router.put('/:id/review', adminAuth, async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    
    const file = await PatientFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    file.status = status;
    file.reviewNotes = reviewNotes;
    file.reviewedBy = req.user._id;
    file.reviewDate = new Date();

    await file.save();
    await file.populate('patient', 'name email');
    await file.populate('reviewedBy', 'name');

    res.json({
      message: 'File reviewed successfully',
      file
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download file
router.get('/:id/download', auth, async (req, res) => {
  try {
    const file = await PatientFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if user owns this file or is admin
    if (req.user.role !== 'admin' && req.user.role !== 'doctor' && 
        file.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(file.filePath, file.fileName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete file
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await PatientFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if user owns this file or is admin
    if (req.user.role !== 'admin' && 
        file.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await PatientFile.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;