import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginModel } from '../models/loginModel';
import { RegisterForCorporateModel } from '../models/registerForCorporateModel';
import { RegisterModel } from '../models/registerModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { UserPasswordModel } from '../models/userPasswordModel';
import { LocalStorageService } from './local-storage.service';

interface DecodedToken {
  [key: string]: string | string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly apiUrl = 'https://localhost:44306/api/auth/';

  // ─── Auth State as Signals ────────────────────────────────────────────────
  // Source of truth: the decoded JWT token. Null when logged out.
  readonly currentUser = signal<DecodedToken | null>(this.tryDecodeToken());

  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  readonly isAdmin = computed(() => this.getRolesFromToken(this.currentUser()).includes('admin'));

  readonly isLocationManager = computed(() =>
    this.getRolesFromToken(this.currentUser()).some(r =>
      ['locationmanager', 'location.manager', 'location manager'].includes(r)
    )
  );

  readonly customerType = computed<'Corporate' | 'Individual'>(() =>
    this.getRolesFromToken(this.currentUser()).includes('corporate') ? 'Corporate' : 'Individual'
  );

  /**
   * Writable signal for the user's display name.
   * Initialized from the JWT token when the service starts or the user logs in.
   * Call updateDisplayName() after a profile name update so the navi
   * re-renders immediately — without a page reload or new token.
   */
  readonly displayName = signal<string>(this.extractNameFromToken(this.tryDecodeToken()));

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelperService: JwtHelperService
  ) { }

  // ─── Auth Methods ─────────────────────────────────────────────────────────

  login(loginModel: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + 'login', loginModel);
  }

  loginForCorporate(loginModel: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + 'loginforcorporate', loginModel);
  }

  logOut(): void {
    this.localStorageService.remove('token');
    this.currentUser.set(null);
  }

  register(registerModel: RegisterModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + 'register', registerModel);
  }

  registerForCorporate(model: RegisterForCorporateModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + 'registerforcorporate', model);
  }

  registerAdmin(registerModel: RegisterModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + 'registeradmin', registerModel);
  }

  updatePassword(userPasswordModel: UserPasswordModel): Observable<ResponseModel> {
    return this.httpClient.put<ResponseModel>(this.apiUrl + 'password', userPasswordModel);
  }

  /**
   * Call after a successful login to store the token and refresh the signal.
   */
  applyToken(token: string): void {
    this.localStorageService.setItem('token', token);
    const decoded = this.tryDecodeToken();
    this.currentUser.set(decoded);
    this.displayName.set(this.extractNameFromToken(decoded));
  }

  /**
   * Update the display name signal without a new token.
   * Call this after a successful profile name update.
   */
  updateDisplayName(firstName: string, lastName: string): void {
    this.displayName.set(`${firstName} ${lastName}`.trim());
  }

  // ─── Keep legacy getters for backward compatibility ───────────────────────

  /** @deprecated Use currentUser signal instead */
  get getDecodedToken(): DecodedToken | null {
    return this.currentUser();
  }

  get getCurrentUserId(): number {
    const token = this.currentUser();
    if (!token) return 0;
    const key = Object.keys(token).find(k => k.endsWith('/nameidentifier'));
    return key ? Number(token[key]) : 0;
  }

  get getCurrentUserName(): string {
    const token = this.currentUser();
    if (!token) return '';
    const key = Object.keys(token).find(k => k.endsWith('/name'));
    return key ? String(token[key]) : '';
  }

  /** @deprecated Use isAuthenticated signal instead */
  isAuthenticatedLegacy(): boolean {
    return !!this.localStorageService.getItem('token');
  }

  /** @deprecated Use isAdmin signal instead */
  isAdminLegacy(): boolean {
    return this.isAdmin();
  }

  /** @deprecated Use isLocationManager signal instead */
  isLocationManagerLegacy(): boolean {
    return this.isLocationManager();
  }

  getRoles(): string[] {
    return this.getRolesFromToken(this.currentUser());
  }

  /** @deprecated Use customerType signal instead */
  getCustomerType(): string {
    return this.customerType();
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private tryDecodeToken(): DecodedToken | null {
    try {
      const token = this.localStorageService.getItem('token');
      if (!token) return null;
      const decoded = this.jwtHelperService.decodeToken(token);
      return decoded ?? null;
    } catch {
      return null;
    }
  }

  private extractNameFromToken(token: DecodedToken | null): string {
    if (!token) return '';
    const key = Object.keys(token).find(k => k.endsWith('/name'));
    return key ? String(token[key]) : '';
  }

  private getRolesFromToken(token: DecodedToken | null): string[] {
    if (!token) return [];
    const roleKey = Object.keys(token).find(k => k.endsWith('/role'));
    if (!roleKey || !token[roleKey]) return [];
    const roles = token[roleKey];
    if (typeof roles === 'string') return [roles.toLowerCase()];
    return (roles as string[]).map(r => r.toLowerCase());
  }
}
