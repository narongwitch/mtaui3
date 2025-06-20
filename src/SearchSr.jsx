import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import { API_BASE_URL, AZURE_PDF_URL } from './config';


const SearchServiceReport = () => {
  const [tabValue, setTabValue] = useState(1);
  const [docNumber, setDocNumber] = useState('');
  const [date, setDate] = useState('');
  const [customer, setCustomer] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //const form = e.target;
    //const formData = new FormData(form);
    const params = new URLSearchParams({
      doc_number: docNumber,
      date,
      customer
    });

    console.log(`API_BASE_URL ${API_BASE_URL}`)
    console.log(`AZURE_PDF_URL ${AZURE_PDF_URL}`)

    //const response = await fetch(`http://localhost:8000/search-reports?${params}`, {
    const response = await fetch(`${API_BASE_URL}/search-reports?${params}`, {
      method: 'GET'
    });

    const data = await response.json();
    //const azure_location = 'https://srpdf.blob.core.windows.net/drpdfcontainer/';
    const azure_location = AZURE_PDF_URL

    if (data.length === 0) {
      setError('ไม่พบข้อมูล');
      setResults([]);
    } else {
      setError('');
      setResults(data.map(r => ({
        ...r,
        url: `${azure_location}${r.pdf_filename}`
      })));
    }
  };

  const handleClear = () => {
    setDocNumber('');
    setDate('');
    setCustomer('');
    setResults([]);
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, backgroundColor: '#f8f9fc' }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Service Report System
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
        Create and search comprehensive service reports with ease
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Create Report" component="a" href="/mainsr" />
        <Tab label="Search Reports" />
      </Tabs>

      <Box className="search-box" sx={{ backgroundColor: '#0d6efd', color: 'white', p: 3, borderRadius: '10px 10px 0 0' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🔍 ค้นหา Service Report
        </Typography>
        <form onSubmit={handleSubmit} action="/ui/search" className="row search-form" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <TextField
            label="เลขเอกสาร"
            variant="outlined"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            name="doc_number"
            fullWidth
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="วันที่"
            type="date"
            variant="outlined"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            name="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="ลูกค้า"
            variant="outlined"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            name="customer"
            fullWidth
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
          <Box display="flex" justifyContent="flex-end" width="100%" gap={2}>
            <Button variant="contained" color="inherit" type="submit">
              🔍 ค้นหา
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              🧹 ล้างฟอร์ม
            </Button>
          </Box>
        </form>
      </Box>

      {error && <Alert severity="warning" sx={{ mt: 3 }}>{error}</Alert>}

      {results.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>เลขเอกสาร</TableCell>
                <TableCell>ลูกค้า</TableCell>
                <TableCell>วันที่</TableCell>
                <TableCell>PDF</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r, index) => (
                <TableRow key={index}>
                  <TableCell>{r.doc_number}</TableCell>
                  <TableCell>{r.header}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      ดู PDF
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SearchServiceReport;