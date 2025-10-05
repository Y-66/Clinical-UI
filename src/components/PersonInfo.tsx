import React, { useState } from "react";
import { Collapse, Row, Col } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  HomeOutlined, 
  MedicineBoxOutlined
} from "@ant-design/icons";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Chip,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

const PersonInfo: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: null as Dayjs | null,
    gender: "male",
    insuranceId: "INS-123456789",
    bloodType: "A+",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  });

  const handleChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  return (
    <div className="w-full h-full">
      <Collapse
        defaultActiveKey={['1']}
        ghost
        className="bg-white"
        items={[
          {
            key: '1',
            label: (
              <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <UserOutlined className="text-cyan-600" />
                Basic Information
              </div>
            ),
            children: (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.fullName}
                      onChange={handleChange('fullName')}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <UserOutlined style={{ color: '#06b6d4', fontSize: '18px' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#06b6d4',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#06b6d4',
                        },
                      }}
                    />
                  </Col>
                  
                  <Col span={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={handleDateChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#06b6d4',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#06b6d4',
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: '#06b6d4',
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Col>
                </Row>

                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#06b6d4',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#06b6d4',
                        },
                      }}
                    >
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        label="Gender"
                        onChange={handleChange('gender')}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  
                  <Col span={12}>
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#06b6d4',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#06b6d4',
                        },
                      }}
                    >
                      <InputLabel>Blood Type</InputLabel>
                      <Select
                        value={formData.bloodType}
                        label="Blood Type"
                        onChange={handleChange('bloodType')}
                        renderValue={(value) => (
                          <Chip 
                            label={value} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                              color: 'white',
                              fontWeight: 600,
                            }} 
                          />
                        )}
                      >
                        <MenuItem value="A+">A+</MenuItem>
                        <MenuItem value="A-">A-</MenuItem>
                        <MenuItem value="B+">B+</MenuItem>
                        <MenuItem value="B-">B-</MenuItem>
                        <MenuItem value="AB+">AB+</MenuItem>
                        <MenuItem value="AB-">AB-</MenuItem>
                        <MenuItem value="O+">O+</MenuItem>
                        <MenuItem value="O-">O-</MenuItem>
          </Select>
                    </FormControl>
                  </Col>
                </Row>
              </Box>
            ),
          },
          {
            key: '2',
            label: (
              <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <MailOutlined className="text-cyan-600" />
                Contact Information
              </div>
            ),
            children: (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlined style={{ color: '#06b6d4', fontSize: '18px' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#06b6d4',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#06b6d4',
                        },
                      }}
                    />
                  </Col>
                  
                  <Col span={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span style={{ color: '#06b6d4', fontSize: '18px' }}>📱</span>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#06b6d4',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#06b6d4',
                        },
                      }}
                    />
                  </Col>
                </Row>
              </Box>
            ),
          },
          {
            key: '3',
            label: (
              <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <MedicineBoxOutlined className="text-cyan-600" />
                Insurance Information
              </div>
            ),
            children: (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Insurance ID"
                  value={formData.insuranceId}
                  onChange={handleChange('insuranceId')}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span style={{ color: '#06b6d4', fontSize: '18px' }}>🆔</span>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#06b6d4',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#06b6d4',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#06b6d4',
                    },
                  }}
                />
              </Box>
            ),
          },
          {
            key: '4',
            label: (
              <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <HomeOutlined className="text-cyan-600" />
                Address Information
              </div>
            ),
            children: (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={formData.address}
                  onChange={handleChange('address')}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeOutlined style={{ color: '#06b6d4', fontSize: '18px' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#06b6d4',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#06b6d4',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#06b6d4',
                    },
                  }}
                />

                <Row gutter={[24, 24]}>
                  <Col span={10}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.city}
                      onChange={handleChange('city')}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span style={{ color: '#06b6d4', fontSize: '18px' }}>🏙️</span>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#06b6d4',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#06b6d4',
                        },
                      }}
                    />
                  </Col>
                  
                  <Col span={7}>
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#06b6d4',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#06b6d4',
                        },
                      }}
                    >
                      <InputLabel>State</InputLabel>
                      <Select
                        value={formData.state}
                        label="State"
                        onChange={handleChange('state')}
                      >
                        <MenuItem value="NY">NY</MenuItem>
                        <MenuItem value="CA">CA</MenuItem>
                        <MenuItem value="TX">TX</MenuItem>
                        <MenuItem value="FL">FL</MenuItem>
                        <MenuItem value="IL">IL</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  
                  <Col span={7}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleChange('zipCode')}
                      required
                      variant="outlined"
                      inputProps={{ maxLength: 5 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#06b6d4',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#06b6d4',
                        },
                      }}
                    />
                  </Col>
                </Row>
              </Box>
            ),
              },
            ]}
          />
    </div>
  );
};

export default PersonInfo;