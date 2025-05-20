import { CrudAbstract } from '../abstracts/crud.abstract';
import { Contact, ContactFormData } from '../types/contact.types';
import { Observable, catchError, tap } from 'rxjs';

export class ContactService extends CrudAbstract<Contact> {
  protected endpoint = 'contact';
  
  constructor() {
    super();
  }
  
  // Override create method to handle form data
  submitContactForm(formData: ContactFormData): Observable<Contact> {
    console.log('ContactService: Submitting contact form with data:', JSON.stringify(formData, null, 2));
    
    return this.post<Contact>(this.getURLBase(), formData).pipe(
      tap(response => {
        console.log('ContactService: Form submission successful, response:', response);
      }),
      catchError(error => {
        console.error('ContactService: Form submission error:', error);
        if (error.response) {
          console.error('ContactService: Error response:', error.response.data);
        }
        throw error;
      })
    );
  }
  
  // Admin functions to manage contacts
  getUnreadContacts(): Observable<Contact[]> {
    return this.get<Contact[]>(`${this.getURLBase()}/unread`);
  }
  
  markAsRead(id: string): Observable<Contact> {
    return this.patch<Contact>(`${this.getURLBase()}/${id}/read`, {});
  }
  
  markAsReplied(id: string): Observable<Contact> {
    return this.patch<Contact>(`${this.getURLBase()}/${id}/replied`, {});
  }
  
  async findAll(): Promise<Contact[]> {
    try {
      console.log(`ContactService: Fetching all contacts from ${this.baseUrl}/${this.endpoint}`);
      const response = await this.http.get(`${this.endpoint}`);
      
      // Check if response has expected structure
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('ContactService: Error fetching contacts:', error);
      throw error;
    }
  }
  
  async findOne(id: string): Promise<Contact | null> {
    try {
      console.log(`ContactService: Fetching contact with ID ${id}`);
      const response = await this.http.get(`${this.endpoint}/${id}`);
      
      // Check if response has expected structure
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`ContactService: Error fetching contact with ID ${id}:`, error);
      return null;
    }
  }
} 