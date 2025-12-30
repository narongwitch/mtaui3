import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Alert,
  Avatar,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { API_BASE_URL } from './config';

// ---- Entity configuration ----

const ENTITY_CONFIGS = {
  tenants: {
    label: 'Tenants',
    path: '/api/tenants',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'description', label: 'Description', multiline: true },
    ],
  },
  sites: {
    label: 'Sites',
    path: '/api/sites',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'description', label: 'Description', multiline: true },
    ],
  },
  buildings: {
    label: 'Buildings',
    path: '/api/buildings',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'description', label: 'Description', multiline: true },
    ],
  },
  floors: {
    label: 'Floors',
    path: '/api/floors',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'description', label: 'Description', multiline: true },
    ],
  },
  zones: {
    label: 'Zones',
    path: '/api/zones',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'description', label: 'Description', multiline: true },
    ],
  },
  rooms: {
    label: 'Rooms',
    path: '/api/rooms',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'description', label: 'Description', multiline: true },
    ],
  },
  deviceTypes: {
    label: 'Device Types',
    path: '/api/device-types',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'description', label: 'Description', multiline: true },
    ],
  },
  maTypes: {
    label: 'MA Types',
    path: '/api/ma-types',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'description', label: 'Description', multiline: true },
    ],
  },
  devices: {
    label: 'Devices',
    path: '/api/devices',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'device_picture_url', label: 'Picture URL' },
      { name: 'description', label: 'Description', multiline: true },
      { name: 'ma_id', label: 'MA Type ID', type: 'number' },
      { name: 'ma_status', label: 'MA Status (number)', type: 'number' },
      { name: 'last_ma_date', label: 'Last MA Date (ISO)', helperText: 'e.g. 2024-01-01T00:00:00Z' },
    ],
  },
  locations: {
    label: 'Locations',
    path: '/api/locations',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'description', label: 'Description', multiline: true },
      { name: 'tenant_id', label: 'Tenant ID', type: 'number' },
      { name: 'site_id', label: 'Site ID', type: 'number' },
      { name: 'building_id', label: 'Building ID', type: 'number' },
      { name: 'floor_id', label: 'Floor ID', type: 'number' },
      { name: 'zone_id', label: 'Zone ID', type: 'number' },
      { name: 'room_id', label: 'Room ID', type: 'number' },
    ],
  },
  deviceLocations: {
    label: 'Device Locations',
    path: '/api/device-locations',
    fields: [
      { name: 'device_id', label: 'Device ID', type: 'number', required: true },
      { name: 'location_id', label: 'Location ID', type: 'number', required: true },
      { name: 'name', label: 'Name' },
      { name: 'description', label: 'Description', multiline: true },
    ],
  },
  serviceReports: {
    label: 'Service Reports',
    path: '/api/service-reports',
    fields: [
      { name: 'doc_number', label: 'Doc Number', required: true },
      { name: 'header', label: 'Header' },
      { name: 'location', label: 'Location' },
      { name: 'date', label: 'Date (YYYY-MM-DD)' },
      { name: 'engineer', label: 'Engineer' },
      { name: 'service_type', label: 'Service Type' },
      { name: 'detail', label: 'Detail', multiline: true },
      { name: 'summary', label: 'Summary', multiline: true },
      { name: 'additional_info', label: 'Additional Info', multiline: true },
      { name: 'pdf_filename', label: 'PDF Filename' },
    ],
  },
  locationPoints: {
    label: 'Location Points',
    path: '/api/location-points',
    fields: [
      { name: 'room', label: 'Room', required: true },
      { name: 'latitude', label: 'Latitude', required: true },
      { name: 'longitude', label: 'Longitude', required: true },
      { name: 'notes', label: 'Notes', multiline: true },
    ],
  },
};

const DEFAULT_ENTITY_KEY = 'tenants';

async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('REACT_APP_API_BASE_URL is not set');
  }
  const url = `${API_BASE_URL}${path}`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text || resp.statusText}`);
  }
  if (resp.status === 204) return null;
  return resp.json();
}

const AdminCrud = () => {
  const [entityKey, setEntityKey] = useState(DEFAULT_ENTITY_KEY);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);

  const config = ENTITY_CONFIGS[entityKey];

  const loadItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest(`${config.path}/?skip=0&limit=100`);
      setItems(data || []);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData({});
    setEditingId(null);
    setPictureFile(null);
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityKey]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Special handling for devices (always use FormData to support optional file upload)
      if (entityKey === 'devices') {
        const formDataToSend = new FormData();
        
        // Add all form fields
        config.fields.forEach((f) => {
          if (f.name === 'device_picture_url') {
            // Skip device_picture_url field - we use file upload instead
            return;
          }
          if (formData[f.name] !== undefined && formData[f.name] !== '') {
            if (f.type === 'number') {
              formDataToSend.append(f.name, Number(formData[f.name]));
            } else {
              formDataToSend.append(f.name, formData[f.name]);
            }
          }
        });
        
        // Add picture file if provided
        if (pictureFile) {
          formDataToSend.append('picture', pictureFile);
        }
        
        const url = editingId 
          ? `${API_BASE_URL}${config.path}/${editingId}`
          : `${API_BASE_URL}${config.path}/`;
        
        const response = await fetch(url, {
          method: editingId ? 'PUT' : 'POST',
          body: formDataToSend,
        });
        
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
        }
      } else {
        // Standard JSON request for other entities or devices without file
        const body = {};
        config.fields.forEach((f) => {
          if (formData[f.name] !== undefined && formData[f.name] !== '') {
            if (f.type === 'number') {
              body[f.name] = Number(formData[f.name]);
            } else {
              body[f.name] = formData[f.name];
            }
          }
        });

        if (editingId) {
          await apiRequest(`${config.path}/${editingId}`, {
            method: 'PUT',
            body: JSON.stringify(body),
          });
        } else {
          await apiRequest(`${config.path}/`, {
            method: 'POST',
            body: JSON.stringify(body),
          });
        }
      }

      setFormData({});
      setEditingId(null);
      setPictureFile(null);
      await loadItems();
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const data = {};
    config.fields.forEach((f) => {
      if (item[f.name] !== undefined && item[f.name] !== null) {
        data[f.name] = String(item[f.name]);
      }
    });
    setFormData(data);
    setPictureFile(null); // Reset picture file when editing
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Delete this item?')) return;
    try {
      setLoading(true);
      setError('');
      await apiRequest(`${config.path}/${id}`, { method: 'DELETE' });
      await loadItems();
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const entityOptions = Object.entries(ENTITY_CONFIGS);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin CRUD Console
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Manage all backend entities via REST APIs. Backend base URL: <code>{API_BASE_URL || 'NOT SET'}</code>
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="entity-select-label">Entity</InputLabel>
          <Select
            labelId="entity-select-label"
            value={entityKey}
            label="Entity"
            onChange={(e) => setEntityKey(e.target.value)}
          >
            {entityOptions.map(([key, cfg]) => (
              <MenuItem key={key} value={key}>
                {cfg.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary">
          API path: {config.path}
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }} component="form" onSubmit={handleSubmit}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {editingId ? 'Edit' : 'Create'} {config.label.slice(0, -1)}
          </Typography>
          <Button
            size="small"
            onClick={() => {
              setEditingId(null);
              setFormData({});
              setPictureFile(null);
            }}
          >
            Clear form
          </Button>
        </Stack>

        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={2}>
          {config.fields.map((field) => {
            // Skip device_picture_url field for devices - we'll use file upload instead
            if (entityKey === 'devices' && field.name === 'device_picture_url') {
              return null;
            }
            return (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={!!field.required && !editingId}
                type={field.type || 'text'}
                multiline={!!field.multiline}
                minRows={field.multiline ? 2 : undefined}
                helperText={field.helperText}
              />
            );
          })}
        </Box>

        {/* File upload for device pictures */}
        {entityKey === 'devices' && (
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>
              Device Picture
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPictureFile(e.target.files[0] || null)}
              style={{ marginBottom: '8px' }}
            />
            <Typography variant="caption" color="text.secondary" display="block">
              {pictureFile 
                ? `Selected: ${pictureFile.name}` 
                : editingId && formData.device_picture_url
                ? 'Upload new picture to replace existing'
                : 'Select an image file to upload'}
            </Typography>
            
            {/* Show current picture preview if available */}
            {!pictureFile && formData.device_picture_url && (
              <Box mt={1}>
                <Typography variant="caption" display="block" gutterBottom>
                  Current Picture:
                </Typography>
                <Avatar
                  src={formData.device_picture_url}
                  alt="Device picture"
                  sx={{ width: 100, height: 100 }}
                  variant="rounded"
                />
              </Box>
            )}
            
            {/* Show preview of selected file */}
            {pictureFile && (
              <Box mt={1}>
                <Typography variant="caption" display="block" gutterBottom>
                  Preview:
                </Typography>
                <Avatar
                  src={URL.createObjectURL(pictureFile)}
                  alt="Preview"
                  sx={{ width: 100, height: 100 }}
                  variant="rounded"
                />
              </Box>
            )}
          </Box>
        )}

        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !API_BASE_URL}
          >
            {editingId ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Existing {config.label}</Typography>
          <Button onClick={loadItems} disabled={loading || !API_BASE_URL}>
            Refresh
          </Button>
        </Stack>

        {!API_BASE_URL && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            REACT_APP_API_BASE_URL is not configured. Set it in your environment for the CRUD UI to work.
          </Alert>
        )}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                {config.fields.map((f) => {
                  // Update labels for locations to show "Name" instead of "ID"
                  if (entityKey === 'locations') {
                    if (f.name === 'tenant_id') {
                      return <TableCell key={f.name}>Tenant Name</TableCell>;
                    }
                    if (f.name === 'site_id') {
                      return <TableCell key={f.name}>Site Name</TableCell>;
                    }
                    if (f.name === 'building_id') {
                      return <TableCell key={f.name}>Building Name</TableCell>;
                    }
                    if (f.name === 'floor_id') {
                      return <TableCell key={f.name}>Floor Name</TableCell>;
                    }
                    if (f.name === 'zone_id') {
                      return <TableCell key={f.name}>Zone Name</TableCell>;
                    }
                    if (f.name === 'room_id') {
                      return <TableCell key={f.name}>Room Name</TableCell>;
                    }
                  }
                  // Update label for devices to show "MA Type Name" instead of "MA Type ID"
                  if (entityKey === 'devices' && f.name === 'ma_id') {
                    return <TableCell key={f.name}>MA Type Name</TableCell>;
                  }
                  // Update label for device_picture_url to show "Picture"
                  if (entityKey === 'devices' && f.name === 'device_picture_url') {
                    return <TableCell key={f.name}>Picture</TableCell>;
                  }
                  // Update labels for deviceLocations to show "Name" instead of "ID"
                  if (entityKey === 'deviceLocations') {
                    if (f.name === 'device_id') {
                      return <TableCell key={f.name}>Device Name</TableCell>;
                    }
                    if (f.name === 'location_id') {
                      return <TableCell key={f.name}>Location Name</TableCell>;
                    }
                  }
                  return <TableCell key={f.name}>{f.label}</TableCell>;
                })}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  {config.fields.map((f) => {
                    // Special handling for locations entity to show names instead of IDs
                    if (entityKey === 'locations') {
                      if (f.name === 'tenant_id' && item.tenant) {
                        return <TableCell key={f.name}>{item.tenant.name || item[f.name]}</TableCell>;
                      }
                      if (f.name === 'site_id' && item.site) {
                        return <TableCell key={f.name}>{item.site.name || item[f.name]}</TableCell>;
                      }
                      if (f.name === 'building_id' && item.building) {
                        return <TableCell key={f.name}>{item.building.name || item[f.name]}</TableCell>;
                      }
                      if (f.name === 'floor_id' && item.floor) {
                        return <TableCell key={f.name}>{item.floor.name || item[f.name]}</TableCell>;
                      }
                      if (f.name === 'zone_id' && item.zone) {
                        return <TableCell key={f.name}>{item.zone.name || item[f.name]}</TableCell>;
                      }
                      if (f.name === 'room_id' && item.room) {
                        return <TableCell key={f.name}>{item.room.name || item[f.name]}</TableCell>;
                      }
                    }
                    // Special handling for devices entity to show MA Type name instead of ID
                    if (entityKey === 'devices' && f.name === 'ma_id' && item.ma_type) {
                      return <TableCell key={f.name}>{item.ma_type.name || item[f.name]}</TableCell>;
                    }
                    // Special handling for deviceLocations entity to show names instead of IDs
                    if (entityKey === 'deviceLocations') {
                      if (f.name === 'device_id' && item.device) {
                        return <TableCell key={f.name}>{item.device.name || item[f.name]}</TableCell>;
                      }
                      if (f.name === 'location_id' && item.location) {
                        return <TableCell key={f.name}>{item.location.name || item[f.name]}</TableCell>;
                      }
                    }
                    // Special handling for device_picture_url to show image preview
                    if (entityKey === 'devices' && f.name === 'device_picture_url' && item.device_picture_url) {
                      return (
                        <TableCell key={f.name}>
                          <Avatar
                            src={item.device_picture_url}
                            alt="Device picture"
                            sx={{ width: 50, height: 50 }}
                            variant="rounded"
                          />
                        </TableCell>
                      );
                    }
                    // Default rendering for other fields
                    return (
                      <TableCell key={f.name}>
                        {typeof item[f.name] === 'boolean'
                          ? String(item[f.name])
                          : item[f.name] != null
                          ? String(item[f.name])
                          : ''}
                      </TableCell>
                    );
                  })}
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(item)}
                      aria-label="edit"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.id)}
                      aria-label="delete"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={config.fields.length + 2} align="center">
                    {loading ? 'Loading...' : 'No data'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminCrud;


