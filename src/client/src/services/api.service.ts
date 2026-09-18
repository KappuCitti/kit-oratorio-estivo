import { Service } from '@angular/core';
import { Theme } from '../models/Theme.model';
import { api, request } from './api-client';
import {
  AdminEnrollmentCreateRequest,
  ClassCreateRequest,
  EnrollmentApprovalRequest,
  EnrollmentGetRequest,
  EnrollmentUpdateRequest,
  FamilyCreateRequest,
  ManagedPersonCreateRequest,
  PeopleGetRequest,
  PersonUpdateRequest,
  QueueEnrollmentCreateRequest,
  QueueGetRequest,
  RegisterRequest,
  SchoolCreateRequest,
  TeamCreateRequest,
  TeamUpdateRequest,
} from '../models/Request.model';
import { toDateOnly } from './utils.service';

/**
 * Le chiamate all'API.
 *
 * Ogni metodo passa dal client tipizzato generato dal server (vedi
 * api-client.ts): percorsi, parametri e forma delle risposte non sono scritti
 * qui. `request()` restituisce un Observable, cosi' i componenti continuano a
 * usare `.subscribe()`.
 */
@Service()
export class ApiService {
  // Niente piu' HttpClient ne' baseUrl: l'indirizzo e le credenziali sono
  // impostati una volta sola in api-client.ts.

  // User
  login(username: string, password: string) {
    return request(api.user.login.$post({ json: { username, password } }));
  }

  logout() {
    return request(api.user.logout.$post());
  }

  /** Registrazione pubblica: crea un account da genitore. */
  register(data: RegisterRequest) {
    return request(api.user.register.$post({ json: data }));
  }

  getUser() {
    return request(api.users.self.$get());
  }

  setUserTheme(theme: Theme) {
    return request(api.user.theme.$put({ json: { theme } }));
  }

  setUserPassword(oldPassword: string, newPassword: string) {
    return request(
      api.user.password.$put({ json: { oldPassword, newPassword } })
    );
  }

  // Enrollments
  getEnrollments(params: EnrollmentGetRequest) {
    return request(api.enrollments.$get({ query: params }));
  }

  getEnrollmentById(id: number) {
    return request(api.enrollments[':id'].$get({ param: { id } }));
  }

  updateEnrollment(enrollment: EnrollmentUpdateRequest) {
    const { id, ...campi } = enrollment;
    return request(
      api.enrollments[':id'].$put({ param: { id }, json: campi })
    );
  }

  deleteEnrollment(id: number) {
    return request(api.enrollments[':id'].$delete({ param: { id } }));
  }

  /**
   * Richiesta di iscrizione inviata da un genitore: finisce in coda, non
   * diventa subito un'iscrizione.
   *
   * E' il flusso che il server implementa davvero. Prima il client chiamava
   * `POST /enrollments`, che invece APPROVA una richiesta gia' in coda e vuole
   * un `queueId`: il corpo mandato non aveva niente a che vedere con quello
   * atteso, quindi la chiamata sarebbe stata rifiutata con 422.
   */
  createQueueEnrollment(enrollment: QueueEnrollmentCreateRequest) {
    return request(api.enrollments.queue.$post({ json: enrollment }));
  }

  /** Le richieste in attesa di approvazione. */
  getEnrollmentQueue(params: QueueGetRequest) {
    return request(api.enrollments.queue.$get({ query: params }));
  }

  /** Approva una richiesta in coda e la trasforma in iscrizione. */
  approveEnrollment(approval: EnrollmentApprovalRequest) {
    return request(api.enrollments.$post({ json: approval }));
  }

  /** Rifiuta una richiesta in coda, cancellandola. */
  rejectEnrollmentRequest(id: number) {
    return request(api.enrollments.queue[':id'].$delete({ param: { id } }));
  }

  /**
   * Lo stato di iscrizione delle persone gestite da chi e' collegato: la
   * vista del genitore, che non ha accesso a GET /enrollments.
   */
  getManagedEnrollments(year: number) {
    return request(api.users.enrollments.$get({ query: { year } }));
  }

  /**
   * L'iscrizione di chi e' collegato: la vista del ragazzo. Lo stato dei
   * pagamenti c'e' solo se chi lo gestisce lo consente.
   */
  getOwnEnrollment(year: number) {
    return request(api.users.self.enrollments.$get({ query: { year } }));
  }

  /** Il genitore decide se il ragazzo vede prezzi e pagamenti. */
  setShowPayments(id: string, showPayments: boolean) {
    return request(
      api.users[':id']['payments-visibility'].$put({
        param: { id },
        json: { showPayments },
      })
    );
  }

  // Weeks
  getWeeks(year: number | string) {
    return request(api.weeks.$get({ query: { year: Number(year) } }));
  }

  /** Limite di posti e comportamento quando e' raggiunto. */
  editWeek(
    id: number,
    changes: { maxEnrollments?: number; allowOverbooking?: boolean }
  ) {
    return request(api.weeks[':id'].$put({ param: { id }, json: changes }));
  }

  // Teams
  getTeams() {
    return request(api.teams.$get());
  }

  createTeam(params: TeamCreateRequest) {
    return request(api.teams.$post({ json: params }));
  }

  updateTeam(team: TeamUpdateRequest) {
    const { id, ...campi } = team;
    return request(api.teams[':id'].$put({ param: { id }, json: campi }));
  }

  deleteTeam(id: number) {
    return request(api.teams[':id'].$delete({ param: { id } }));
  }

  // Shirts
  getShirts() {
    return request(api.shirts.$get());
  }

  // Families
  /** Le persone gestite da chi e' collegato: tipicamente i propri figli. */
  getManagedPeople() {
    return request(api.users.$get());
  }

  /** Aggiunge un ragazzo al proprio nucleo; il ruolo lo decide il server. */
  addManagedPerson(person: ManagedPersonCreateRequest) {
    return request(api.users.$post({ json: person }));
  }

  // Rubrica (amministrazione)
  //
  // Sostituiscono i vecchi metodi verso /people, /childs/* e /parents/*, che
  // puntavano a rotte mai esistite. Adesso le rotte esistono davvero.

  /**
   * I ruoli assegnabili.
   *
   * Serve alle pagine che creano o modificano una persona: il server vuole un
   * `roleId`, e senza questo elenco il client dovrebbe inventarsi i numeri.
   */
  getRoles() {
    return request(api.roles.$get());
  }

  /** Elenco delle persone, con ricerca e paginazione. */
  getPeople(params: PeopleGetRequest) {
    return request(api.admin.people.$get({ query: params }));
  }

  /** Dettaglio di una persona, con chi la gestisce e chi gestisce. */
  getPerson(id: string) {
    return request(api.admin.people[':id'].$get({ param: { id } }));
  }

  updatePerson(id: string, data: PersonUpdateRequest) {
    return request(
      api.admin.people[':id'].$put({ param: { id }, json: data })
    );
  }

  deletePerson(id: string) {
    return request(api.admin.people[':id'].$delete({ param: { id } }));
  }

  /** Crea un nucleo familiare e i legami fra le persone, in una transazione. */
  createFamily(family: FamilyCreateRequest) {
    return request(api.admin.family.$post({ json: family }));
  }

  /**
   * Crea un'iscrizione direttamente, senza passare dalla coda.
   *
   * Con `ignoreRestrictions` si scavalcano la finestra di iscrizione e il
   * limite di posti: e' l'iscrizione "super" dello sportello.
   */
  createEnrollmentAsAdmin(enrollment: AdminEnrollmentCreateRequest) {
    return request(api.admin.enrollments.$post({ json: enrollment }));
  }

  // Attendance
  getAttendances(params: { date: string }) {
    return request(api.attendances.$get({ query: params }));
  }

  addAttendance(params: { date: string | Date; userId: string }) {
    return request(
      api.attendances.$post({
        json: { date: toDateOnly(params.date), userId: params.userId },
      })
    );
  }

  deleteAttendance(id: number) {
    return request(api.attendances[':id'].$delete({ param: { id } }));
  }

  updateAttendance(
    id: number,
    date: string | Date,
    eatsInOratory: boolean
  ) {
    return request(
      api.attendances[':id'].$put({
        param: { id },
        json: { date: toDateOnly(date), eatsInOratory },
      })
    );
  }

  // Schools and classes
  getSchools(query?: string) {
    return request(api.schools.$get({ query: query ? { query } : {} }));
  }

  createSchool(school: SchoolCreateRequest) {
    return request(api.schools.$post({ json: school }));
  }

  /**
   * Classi, eventualmente filtrate per scuola.
   *
   * Prima il parametro si chiamava `query` ed era una stringa: il server non
   * lo ha mai accettato, l'unico filtro previsto e' `schoolId`. Nessun
   * chiamante lo passava, quindi il disallineamento non si era mai visto.
   */
  getClasses(schoolId?: number) {
    return request(api.classes.$get({ query: schoolId ? { schoolId } : {} }));
  }

  createClass(classData: ClassCreateRequest) {
    // La rotta e' POST /classes: /schools/classes non esiste sul server.
    return request(api.classes.$post({ json: classData }));
  }

  // Stats
  /**
   * Presenze del giorno raggruppate per scuola e classe.
   *
   * L'endpoint e' GET /attendances/grouped: /stats/attendances non esiste (il
   * server ha /stats/users/{year}, che e' un'altra cosa). La data va passata
   * come YYYY-MM-DD, altrimenti il server risponde 422 "Invalid date".
   */
  getAttendancesStat(date: string | Date) {
    return request(
      api.attendances.grouped.$get({ query: { date: toDateOnly(date) } })
    );
  }
}
