import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { filesAPI, formatDate, getStatusColor } from '../../utils/api';
import { theme } from '../../styles/theme';

const PageWrap = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0 0 16px 0;
  color: ${theme.colors.primary.darkBlue};
`;

const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: ${theme.sizes.borderRadius};
  box-shadow: ${theme.shadows.md};
  padding: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th, td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  th {
    color: ${theme.colors.secondary.gray};
    font-weight: 600;
  }
`;

const StatusTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  color: white;
  background: ${props => props.color || '#888'};
  font-size: 12px;
`;

const ActionBtn = styled.button`
  border: none;
  background: ${props => props.variant === 'primary' ? theme.colors.primary.lightBlue : '#e5e7eb'};
  color: ${props => props.variant === 'primary' ? 'white' : '#111827'};
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
  margin-right: 8px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

const Files = () => {
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', fileType: 'all' });

  // Load all user files from localStorage for admin view
  useEffect(() => {
    setLoading(true);
    try {
      // Gather all user_files_* keys
      const allFiles = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_files_')) {
          const userFiles = JSON.parse(localStorage.getItem(key) || '[]');
          allFiles.push(...userFiles.map(f => ({ ...f, userKey: key })));
        }
      }
      setFiles(allFiles);
      setTotalPages(1);
      setPage(1);
    } catch (e) {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onFilterChange = (e) => {
    const next = { ...filters, [e.target.name]: e.target.value };
    setFilters(next);
    fetchFiles(1, next);
  };

  const reviewFile = async (id, status) => {
    try {
      await filesAPI.review(id, { status });
      fetchFiles();
    } catch (e) {
      console.error(e);
    }
  };


  // downloadFile is not used for localStorage files, so we can remove it or leave as a stub

  return (
    <PageWrap>
      <Title>Patient Files</Title>
      <Card>
        <Table>
          <thead>
            <tr>
              <th>Patient Key</th>
              <th>File</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6">Loading...</td></tr>
            ) : files.length === 0 ? (
              <tr><td colSpan="6">No files found</td></tr>
            ) : files.map((f, idx) => (
              <tr key={f.name + idx}>
                <td>{f.userKey.replace('user_files_', '')}</td>
                <td><a href={f.base64} download={f.name} style={{ color: '#3b82f6', textDecoration: 'underline' }}>{f.name}</a></td>
                <td>{f.fileType}</td>
                <td>{(f.size / 1024).toFixed(1)} KB</td>
                <td>{f.uploadedAt ? new Date(f.uploadedAt).toLocaleString() : ''}</td>
                <td>
                  <ActionBtn onClick={() => window.open(f.base64, '_blank')}>View</ActionBtn>
                  <ActionBtn onClick={() => {
                    const a = document.createElement('a');
                    a.href = f.base64;
                    a.download = f.name;
                    a.click();
                  }}>Download</ActionBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination>
          <ActionBtn disabled={page <= 1}>Prev</ActionBtn>
          <span style={{ alignSelf: 'center' }}>{page} / {totalPages}</span>
          <ActionBtn disabled={page >= totalPages}>Next</ActionBtn>
        </Pagination>
      </Card>
    </PageWrap>
  );
};

export default Files;
