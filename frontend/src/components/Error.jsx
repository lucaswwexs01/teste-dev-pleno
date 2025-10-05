import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications,
  Security,
  Palette,
  Language,
  Storage,
  CloudUpload,
  CloudDownload
} from '@mui/icons-material';
import { Loading } from '../components/Loading';
import { ErrorDisplay } from '../components/Error';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'pt-BR',
    autoSave: true,
    emailNotifications: true,
    systemUpdates: true
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError(null);
    } catch (error) {
      setError('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => setError(null)} />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      p: 3
    }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1976d2',
            mb: 1
          }}
        >
          Configurações
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 400
          }}
        >
          Gerencie as configurações do sistema
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Notifications sx={{ fontSize: 32, mr: 2, color: '#FF9800' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  Notificações
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Notifications color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Notificações Gerais"
                    secondary="Receber notificações do sistema"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications}
                        onChange={() => handleToggle('notifications')}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Notificações por Email"
                    secondary="Receber notificações por email"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={() => handleToggle('emailNotifications')}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Palette sx={{ fontSize: 32, mr: 2, color: '#9C27B0' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  Aparência
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Palette color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Modo Escuro"
                    secondary="Ativar tema escuro"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={() => handleToggle('darkMode')}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                select
                label="Idioma"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                SelectProps={{
                  native: true,
                }}
                sx={{ mt: 2 }}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </TextField>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SettingsIcon sx={{ fontSize: 32, mr: 2, color: '#2196F3' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  Sistema
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Storage color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Salvamento Automático"
                    secondary="Salvar alterações automaticamente"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoSave}
                        onChange={() => handleToggle('autoSave')}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Security color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Atualizações do Sistema"
                    secondary="Receber notificações de atualizações"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.systemUpdates}
                        onChange={() => handleToggle('systemUpdates')}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CloudUpload sx={{ fontSize: 32, mr: 2, color: '#4CAF50' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  Backup e Dados
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderColor: '#4CAF50',
                    color: '#4CAF50',
                    '&:hover': {
                      backgroundColor: '#4CAF50',
                      color: 'white'
                    }
                  }}
                >
                  Fazer Backup dos Dados
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<CloudDownload />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderColor: '#2196F3',
                    color: '#2196F3',
                    '&:hover': {
                      backgroundColor: '#2196F3',
                      color: 'white'
                    }
                  }}
                >
                  Restaurar Backup
                </Button>
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                Recomendamos fazer backup dos seus dados regularmente para evitar perda de informações.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            backgroundColor: '#1976d2',
            px: 4,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#1565c0',
            }
          }}
        >
          Salvar Configurações
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
