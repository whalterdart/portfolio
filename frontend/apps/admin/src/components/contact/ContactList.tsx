'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  IconButton,
  CircularProgress,
  Tooltip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { 
  MarkEmailRead as MarkReadIcon, 
  Email as EmailIcon,
  Visibility as ViewIcon,
  Check as RepliedIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ContactService } from '@lib/services/contact.service';
import { Contact } from '@lib/types/contact.types';

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const contactService = new ContactService();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.findAll();
      setContacts(data);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDialogOpen(true);
    
    // If contact is unread, mark it as read
    if (!contact.read) {
      handleMarkAsRead(contact);
    }
  };

  const handleMarkAsRead = (contact: Contact) => {
    contactService.markAsRead(contact.id || contact._id || '').subscribe({
      next: () => {
        setContacts(prev => prev.map(c => 
          (c.id === contact.id || c._id === contact._id) ? { ...c, read: true } : c
        ));
        if (selectedContact && (selectedContact.id === contact.id || selectedContact._id === contact._id)) {
          setSelectedContact({ ...selectedContact, read: true });
        }
      },
      error: (err) => console.error('Erro ao marcar como lido:', err)
    });
  };

  const handleMarkAsReplied = (contact: Contact) => {
    contactService.markAsReplied(contact.id || contact._id || '').subscribe({
      next: () => {
        setContacts(prev => prev.map(c => 
          (c.id === contact.id || c._id === contact._id) ? { ...c, replied: true } : c
        ));
        if (selectedContact && (selectedContact.id === contact.id || selectedContact._id === contact._id)) {
          setSelectedContact({ ...selectedContact, replied: true });
        }
      },
      error: (err) => console.error('Erro ao marcar como respondido:', err)
    });
  };

  const handleDelete = (contact: Contact) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      contactService.remove(contact.id || contact._id || '').subscribe({
        next: () => {
          setContacts(prev => prev.filter(c => c.id !== contact.id && c._id !== contact._id));
          if (dialogOpen) setDialogOpen(false);
        },
        error: (err) => console.error('Erro ao excluir contato:', err)
      });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Assunto</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="textSecondary" sx={{ py: 4 }}>
                    Nenhum contato encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              contacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact) => (
                <TableRow 
                  key={contact.id || contact._id} 
                  sx={{ 
                    '&:hover': { bgcolor: 'action.hover' },
                    bgcolor: !contact.read ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                  }}
                >
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {!contact.read && <EmailIcon fontSize="small" color="primary" sx={{ mr: 1 }} />}
                      {contact.subject}
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(contact.createdAt)}</TableCell>
                  <TableCell>
                    {!contact.read ? (
                      <Chip size="small" label="Não lido" color="primary" />
                    ) : !contact.replied ? (
                      <Chip size="small" label="Lido" color="default" />
                    ) : (
                      <Chip size="small" label="Respondido" color="success" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Ver detalhes">
                        <IconButton size="small" onClick={() => handleViewContact(contact)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {!contact.read && (
                        <Tooltip title="Marcar como lido">
                          <IconButton size="small" onClick={() => handleMarkAsRead(contact)}>
                            <MarkReadIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {contact.read && !contact.replied && (
                        <Tooltip title="Marcar como respondido">
                          <IconButton size="small" onClick={() => handleMarkAsReplied(contact)}>
                            <RepliedIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={() => handleDelete(contact)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

      {/* Contact Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedContact && (
          <>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                Mensagem de {selectedContact.name}
                {!selectedContact.read ? (
                  <Chip size="small" label="Não lido" color="info" sx={{ ml: 2 }} />
                ) : !selectedContact.replied ? (
                  <Chip size="small" label="Lido" color="default" sx={{ ml: 2 }} />
                ) : (
                  <Chip size="small" label="Respondido" color="success" sx={{ ml: 2 }} />
                )}
              </Box>
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary">Data</Typography>
                <Typography variant="body1">{formatDate(selectedContact.createdAt)}</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary">De</Typography>
                <Typography variant="body1">{selectedContact.name} ({selectedContact.email})</Typography>
              </Box>
              
              {selectedContact.phone && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary">Telefone</Typography>
                  <Typography variant="body1">{selectedContact.phone}</Typography>
                </Box>
              )}
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary">Assunto</Typography>
                <Typography variant="body1">{selectedContact.subject}</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary">Mensagem</Typography>
                <Card sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedContact.message}
                  </Typography>
                </Card>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              {!selectedContact.replied && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => handleMarkAsReplied(selectedContact)}
                  startIcon={<RepliedIcon />}
                >
                  Marcar como Respondido
                </Button>
              )}
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => handleDelete(selectedContact)}
                startIcon={<DeleteIcon />}
              >
                Excluir
              </Button>
              <Button onClick={() => setDialogOpen(false)}>
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 