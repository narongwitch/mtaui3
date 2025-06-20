import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Paper,
  Avatar
} from '@mui/material';
import { API_BASE_URL } from './config';

const MainServiceReport = () => {
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const avatar = params.get('avatar');

    if (name) setUserName(name);
    if (avatar) setUserAvatar(avatar);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    console.log(`API_BASE_URL ${API_BASE_URL}`)

    //const response = await fetch('http://localhost:8000/create-pdf/', {
    const response = await fetch(`${API_BASE_URL}/create-pdf/`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result.download_url) {
      const url = result.download_url;
      setPdfUrl(url);
      setPreviewHtml(`
        <p><strong>PDF Created:</strong></p>
        <p>
          <a href="${url}" target="_blank">🖥️ View in New Tab</a> |
          <a href="${url}" download>📥 Download PDF</a>
        </p>
      `);
    } else {
      setPreviewHtml(`<p style="color:red;">Error: ${JSON.stringify(result)}</p>`);
      setPdfUrl('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, backgroundColor: '#f8f9fc' }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Service Report System
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
        Create and search comprehensive service reports with ease
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography>👤 {userName}</Typography>
        {userAvatar && <Avatar alt="avatar" src={userAvatar} sx={{ width: 56, height: 56 }} />}
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Create Report" />
        <Tab label="Search Reports" component="a" href="/searchsr" />
      </Tabs>

      <Paper elevation={2} sx={{ p: 4 }}>
        <form id="reportForm" onSubmit={handleSubmit}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📘 Create Service Report
          </Typography>

          <TextField
            fullWidth
            label="ชื่อลูกค้า"
            name="header"
            required
            margin="normal"
          />

          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="สถานที่"
              name="location"
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="วันที่"
              name="date"
              type="date"
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Engineer"
              name="engineer"
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Service Type</InputLabel>
              <Select name="service_type" label="Service Type" required>
                <MenuItem value="">Select service type</MenuItem>
                <MenuItem value="ติดตั้งใหม่">ติดตั้งใหม่</MenuItem>
                <MenuItem value="ซ่อม">ซ่อม</MenuItem>
                <MenuItem value="บริการ">บริการ</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="รายละเอียด"
            name="detail"
            required
            margin="normal"
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="สรุปงาน"
            name="summary"
            required
            margin="normal"
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="ข้อมูลเพิ่มเติม"
            name="additional_info"
            margin="normal"
          />

          <Box mt={2}>
            <InputLabel>แนบรูป (สูงสุด 4)</InputLabel>
            <input
              type="file"
              name="pictures"
              id="pictures"
              accept="image/*"
              multiple
              style={{ display: 'block', marginBottom: '8px' }}
            />
            <Typography variant="caption" color="text.secondary">
              Supports JPG, PNG, GIF up to 10MB each (max 4 files)
            </Typography>
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            📄 Generate PDF
          </Button>
        </form>

        <Box mt={4} dangerouslySetInnerHTML={{ __html: previewHtml }}></Box>

        {pdfUrl && (
          <iframe
            id="pdfViewer"
            title="PDF Viewer"
            src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
            style={{ width: '100%', height: '600px', border: '1px solid #ccc', marginTop: '20px' }}
          ></iframe>
        )}
      </Paper>
    </Container>
  );
};

export default MainServiceReport;
