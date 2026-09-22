/**
 * FILE GENERATO - non modificarlo a mano.
 *
 * Contratto dell'API del server, prodotto da
 * src/server/scripts/generateClientApiType.ts a partire dai tipi veri delle
 * rotte (src/server/src/router/v1).
 *
 * Per rigenerarlo:  cd src/server && bun run sync:api-type
 * Per verificarlo:  cd src/server && bun run sync:api-type -- --check
 *
 * Il controllo gira dentro `bun run check` del server, quindi una rotta
 * aggiunta o cambiata fa fallire la verifica finche' questo file non viene
 * rigenerato.
 */
import { OpenAPIHono } from '@hono/zod-openapi';
import { Hono } from 'hono';
// Il tipo del logger del server non interessa al client: `hc` usa solo lo
// schema delle rotte. Sostituito per non trascinare le dipendenze di
// logging del server dentro quelle del client.
type PinoLogger = unknown;

interface Bindings {
	Variables: {
		logger: PinoLogger;
	};
}
declare const v1Router: import("@hono/zod-openapi").OpenAPIHono<Bindings, import("hono/types").MergeSchemaPath<{
	"/weeks": {
		$get: {
			input: {
				query: {
					year: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					year: number;
				};
			};
			output: {
				success: true;
				data: {
					id: number;
					startDate: string;
					endDate: string;
					price: string | null;
					maxEnrollments: number;
					registrationOpenDate: string;
					registrationCloseDate: string;
					allowOverbooking: boolean;
					isFull: boolean;
					enrolledCount: number | null;
				}[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/weeks": {
		$post: {
			input: {
				json: {
					startDate: string;
					endDate: string;
					price: number;
					maxEnrollments: number;
					registrationOpenDate: string;
					registrationCloseDate: string;
					allowOverbooking?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					startDate: string;
					endDate: string;
					price: number;
					maxEnrollments: number;
					registrationOpenDate: string;
					registrationCloseDate: string;
					allowOverbooking?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					startDate: string;
					endDate: string;
					price: number;
					maxEnrollments: number;
					registrationOpenDate: string;
					registrationCloseDate: string;
					allowOverbooking?: boolean | undefined;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/weeks/:id": {
		$put: {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					maxEnrollments?: number | undefined;
					allowOverbooking?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					maxEnrollments?: number | undefined;
					allowOverbooking?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					maxEnrollments?: number | undefined;
					allowOverbooking?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					maxEnrollments?: number | undefined;
					allowOverbooking?: boolean | undefined;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/admin/users/bulk": {
		$post: {
			input: {
				json: {
					users: {
						name: string;
						password: string;
						surname: string;
						gender: "M" | "F";
						birthDate: string;
						birthPlace: string;
						cf: string;
						managers: (string | {
							name: string;
							password: string;
							email: string;
							surname: string;
							gender: "M" | "F";
							birthDate: string;
							birthPlace: string;
							cf: string;
							phoneNumber: string;
							role: number;
							address: {
								street: string;
								city: string;
								postalCode: string;
								country: string;
							};
						})[];
						role: number;
						address: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						};
						email?: string | undefined;
						phoneNumber?: string | undefined;
					}[];
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					users: {
						name: string;
						password: string;
						surname: string;
						gender: "M" | "F";
						birthDate: string;
						birthPlace: string;
						cf: string;
						managers: (string | {
							name: string;
							password: string;
							email: string;
							surname: string;
							gender: "M" | "F";
							birthDate: string;
							birthPlace: string;
							cf: string;
							phoneNumber: string;
							role: number;
							address: {
								street: string;
								city: string;
								postalCode: string;
								country: string;
							};
						})[];
						role: number;
						address: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						};
						email?: string | undefined;
						phoneNumber?: string | undefined;
					}[];
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					users: {
						name: string;
						password: string;
						surname: string;
						gender: "M" | "F";
						birthDate: string;
						birthPlace: string;
						cf: string;
						managers: (string | {
							name: string;
							password: string;
							email: string;
							surname: string;
							gender: "M" | "F";
							birthDate: string;
							birthPlace: string;
							cf: string;
							phoneNumber: string;
							role: number;
							address: {
								street: string;
								city: string;
								postalCode: string;
								country: string;
							};
						})[];
						role: number;
						address: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						};
						email?: string | undefined;
						phoneNumber?: string | undefined;
					}[];
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				json: {
					users: {
						name: string;
						password: string;
						surname: string;
						gender: "M" | "F";
						birthDate: string;
						birthPlace: string;
						cf: string;
						managers: (string | {
							name: string;
							password: string;
							email: string;
							surname: string;
							gender: "M" | "F";
							birthDate: string;
							birthPlace: string;
							cf: string;
							phoneNumber: string;
							role: number;
							address: {
								street: string;
								city: string;
								postalCode: string;
								country: string;
							};
						})[];
						role: number;
						address: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						};
						email?: string | undefined;
						phoneNumber?: string | undefined;
					}[];
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 403;
		};
	};
} & {
	"/users/self": {
		$get: {
			input: {};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {};
			output: {
				success: true;
				data: {
					id: string;
					email: string | null;
					theme: "Dark" | "Light" | "System";
					phone: string | null;
					showPayments: boolean;
					role: {
						id: number;
						name: string;
						displayName: string;
						permissions: ("be_enrolled" | "be_managed" | "be_selected" | "give_exit_authorization" | "login" | "manage_activities" | "manage_attendances" | "manage_classes" | "manage_enrollments" | "manage_events" | "manage_personal_info" | "manage_roles" | "manage_self_child_users" | "manage_teams" | "manage_users" | "manage_weeks" | "register" | "register_child_users" | "see_activities" | "see_classes" | "see_personal_info" | "see_stats" | "see_users")[];
					};
					name: string;
					surname: string;
					gender: "M" | "F" | null;
					birthDate: string | null;
					birthPlace: string | null;
					address: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | null;
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/user/password": {
		$put: {
			input: {
				json: {
					newPassword: string;
					oldPassword: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					newPassword: string;
					oldPassword: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					newPassword: string;
					oldPassword: string;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				json: {
					newPassword: string;
					oldPassword: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 401;
		};
	};
} & {
	"/user/theme": {
		$put: {
			input: {
				json: {
					theme: "Dark" | "Light" | "System";
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					theme: "Dark" | "Light" | "System";
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				json: {
					theme: "Dark" | "Light" | "System";
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 401;
		};
	};
} & {
	"/users": {
		$post: {
			input: {
				json: {
					name: string;
					password: string;
					surname: string;
					gender: "M" | "F";
					birthDate: string;
					birthPlace: string;
					cf: string;
					address: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					};
					email?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					surname: string;
					gender: "M" | "F";
					birthDate: string;
					birthPlace: string;
					cf: string;
					address: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					};
					email?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					surname: string;
					gender: "M" | "F";
					birthDate: string;
					birthPlace: string;
					cf: string;
					address: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					};
					email?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					surname: string;
					gender: "M" | "F";
					birthDate: string;
					birthPlace: string;
					cf: string;
					address: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					};
					email?: string | undefined;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					surname: string;
					gender: "M" | "F";
					birthDate: string;
					birthPlace: string;
					cf: string;
					address: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					};
					email?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 403;
		};
	};
} & {
	"/users": {
		$get: {
			input: {};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {};
			output: {
				success: true;
				data: {
					id: string;
					email: string | null;
					phone: string | null;
					showPayments: boolean;
					role: {
						id: number;
						name: string;
						displayName: string;
					};
					name: string;
					surname: string;
					gender: "M" | "F" | null;
					birthDate: string | null;
					birthPlace: string | null;
				}[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/admin/users": {
		$post: {
			input: {
				json: {
					name: string;
					password: string;
					roleId: number;
					surname: string;
					gender: "M" | "F";
					cf: string;
					email?: string | undefined;
					birthDate?: string | undefined;
					birthPlace?: string | undefined;
					phoneNumber?: string | undefined;
					address?: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					roleId: number;
					surname: string;
					gender: "M" | "F";
					cf: string;
					email?: string | undefined;
					birthDate?: string | undefined;
					birthPlace?: string | undefined;
					phoneNumber?: string | undefined;
					address?: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					roleId: number;
					surname: string;
					gender: "M" | "F";
					cf: string;
					email?: string | undefined;
					birthDate?: string | undefined;
					birthPlace?: string | undefined;
					phoneNumber?: string | undefined;
					address?: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					roleId: number;
					surname: string;
					gender: "M" | "F";
					cf: string;
					email?: string | undefined;
					birthDate?: string | undefined;
					birthPlace?: string | undefined;
					phoneNumber?: string | undefined;
					address?: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | undefined;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/users/:id/payments-visibility": {
		$put: {
			input: {
				param: {
					id: string;
				};
			} & {
				json: {
					showPayments: boolean;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: string;
				};
			} & {
				json: {
					showPayments: boolean;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				param: {
					id: string;
				};
			} & {
				json: {
					showPayments: boolean;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 403;
		};
	};
} & {
	"/admin/people": {
		$get: {
			input: {
				query: {
					query?: string | undefined;
					roleId?: number | undefined;
					gender?: "M" | "F" | undefined;
					page?: number | undefined;
					size?: number | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					query?: string | undefined;
					roleId?: number | undefined;
					gender?: "M" | "F" | undefined;
					page?: number | undefined;
					size?: number | undefined;
				};
			};
			output: {
				success: true;
				data: {
					count: number;
					elements: {
						id: string;
						name: string;
						email: string | null;
						phone: string | null;
						surname: string;
						gender: "M" | "F" | null;
						birthDate: string | null;
						role: {
							id: number;
							name: string;
							displayName: string;
						};
					}[];
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/admin/people/:id": {
		$get: {
			input: {
				param: {
					id: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: string;
				};
			};
			output: {
				success: true;
				data: {
					id: string;
					name: string;
					email: string | null;
					phone: string | null;
					surname: string;
					gender: "M" | "F" | null;
					birthDate: string | null;
					birthPlace: string | null;
					managers: {
						id: string;
						name: string;
						email: string | null;
						phone: string | null;
						surname: string;
						gender: "M" | "F" | null;
						birthDate: string | null;
						birthPlace: string | null;
						role: {
							id: number;
							name: string;
							displayName: string;
						};
					}[];
					role: {
						id: number;
						name: string;
						displayName: string;
					};
					address: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | null;
					managed: {
						id: string;
						name: string;
						email: string | null;
						phone: string | null;
						surname: string;
						gender: "M" | "F" | null;
						birthDate: string | null;
						birthPlace: string | null;
						role: {
							id: number;
							name: string;
							displayName: string;
						};
					}[];
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/admin/people/:id": {
		$put: {
			input: {
				param: {
					id: string;
				};
			} & {
				json: {
					name?: string | undefined;
					email?: string | null | undefined;
					phone?: string | null | undefined;
					roleId?: number | undefined;
					surname?: string | undefined;
					gender?: "M" | "F" | undefined;
					birthDate?: string | null | undefined;
					birthPlace?: string | null | undefined;
					address?: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				param: {
					id: string;
				};
			} & {
				json: {
					name?: string | undefined;
					email?: string | null | undefined;
					phone?: string | null | undefined;
					roleId?: number | undefined;
					surname?: string | undefined;
					gender?: "M" | "F" | undefined;
					birthDate?: string | null | undefined;
					birthPlace?: string | null | undefined;
					address?: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				param: {
					id: string;
				};
			} & {
				json: {
					name?: string | undefined;
					email?: string | null | undefined;
					phone?: string | null | undefined;
					roleId?: number | undefined;
					surname?: string | undefined;
					gender?: "M" | "F" | undefined;
					birthDate?: string | null | undefined;
					birthPlace?: string | null | undefined;
					address?: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: string;
				};
			} & {
				json: {
					name?: string | undefined;
					email?: string | null | undefined;
					phone?: string | null | undefined;
					roleId?: number | undefined;
					surname?: string | undefined;
					gender?: "M" | "F" | undefined;
					birthDate?: string | null | undefined;
					birthPlace?: string | null | undefined;
					address?: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: string;
				};
			} & {
				json: {
					name?: string | undefined;
					email?: string | null | undefined;
					phone?: string | null | undefined;
					roleId?: number | undefined;
					surname?: string | undefined;
					gender?: "M" | "F" | undefined;
					birthDate?: string | null | undefined;
					birthPlace?: string | null | undefined;
					address?: {
						street: string;
						city: string;
						postalCode: string;
						country: string;
					} | null | undefined;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/admin/people/:id": {
		$delete: {
			input: {
				param: {
					id: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				param: {
					id: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: string;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/admin/family": {
		$post: {
			input: {
				json: {
					managers: {
						name: string;
						password: string;
						roleId: number;
						surname: string;
						gender: "M" | "F";
						cf: string;
						email?: string | null | undefined;
						phone?: string | null | undefined;
						birthDate?: string | null | undefined;
						birthPlace?: string | null | undefined;
						address?: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						} | null | undefined;
					}[];
					managed: {
						name: string;
						password: string;
						roleId: number;
						surname: string;
						gender: "M" | "F";
						cf: string;
						email?: string | null | undefined;
						phone?: string | null | undefined;
						birthDate?: string | null | undefined;
						birthPlace?: string | null | undefined;
						address?: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						} | null | undefined;
					}[];
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					managers: {
						name: string;
						password: string;
						roleId: number;
						surname: string;
						gender: "M" | "F";
						cf: string;
						email?: string | null | undefined;
						phone?: string | null | undefined;
						birthDate?: string | null | undefined;
						birthPlace?: string | null | undefined;
						address?: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						} | null | undefined;
					}[];
					managed: {
						name: string;
						password: string;
						roleId: number;
						surname: string;
						gender: "M" | "F";
						cf: string;
						email?: string | null | undefined;
						phone?: string | null | undefined;
						birthDate?: string | null | undefined;
						birthPlace?: string | null | undefined;
						address?: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						} | null | undefined;
					}[];
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					managers: {
						name: string;
						password: string;
						roleId: number;
						surname: string;
						gender: "M" | "F";
						cf: string;
						email?: string | null | undefined;
						phone?: string | null | undefined;
						birthDate?: string | null | undefined;
						birthPlace?: string | null | undefined;
						address?: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						} | null | undefined;
					}[];
					managed: {
						name: string;
						password: string;
						roleId: number;
						surname: string;
						gender: "M" | "F";
						cf: string;
						email?: string | null | undefined;
						phone?: string | null | undefined;
						birthDate?: string | null | undefined;
						birthPlace?: string | null | undefined;
						address?: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						} | null | undefined;
					}[];
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					managers: {
						name: string;
						password: string;
						roleId: number;
						surname: string;
						gender: "M" | "F";
						cf: string;
						email?: string | null | undefined;
						phone?: string | null | undefined;
						birthDate?: string | null | undefined;
						birthPlace?: string | null | undefined;
						address?: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						} | null | undefined;
					}[];
					managed: {
						name: string;
						password: string;
						roleId: number;
						surname: string;
						gender: "M" | "F";
						cf: string;
						email?: string | null | undefined;
						phone?: string | null | undefined;
						birthDate?: string | null | undefined;
						birthPlace?: string | null | undefined;
						address?: {
							street: string;
							city: string;
							postalCode: string;
							country: string;
						} | null | undefined;
					}[];
				};
			};
			output: {
				success: true;
				data: string[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/teams": {
		$get: {
			input: {};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {};
			output: {
				success: true;
				data: {
					id: number;
					name: string;
					color: string;
				}[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/teams": {
		$post: {
			input: {
				json: {
					name: string;
					color: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					name: string;
					color: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					name: string;
					color: string;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/teams/:id": {
		$delete: {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/teams/:id": {
		$put: {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					name?: string | undefined;
					color?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					name?: string | undefined;
					color?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					name?: string | undefined;
					color?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					name?: string | undefined;
					color?: string | undefined;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/stats/users/:year": {
		$get: {
			input: {
				param: {
					year?: number | undefined;
				};
			};
			output: {
				success: true;
				data: {
					schools: {
						id: number;
						name: string;
						classes: {
							id: number;
							name: string;
							total: number;
						}[];
						total: number;
					}[];
					total: number;
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/shirts": {
		$get: {
			input: {};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {};
			output: {
				success: true;
				data: {
					id: number;
					sizeName: string;
					width: string;
					height: string;
					isAvailable: boolean;
				}[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/shirts/:id": {
		$delete: {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/shirts": {
		$post: {
			input: {
				json: {
					sizeName: string;
					width: string;
					height: string;
					isAvailable?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					sizeName: string;
					width: string;
					height: string;
					isAvailable?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					sizeName: string;
					width: string;
					height: string;
					isAvailable?: boolean | undefined;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/shirts/:id": {
		$put: {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					sizeName?: string | undefined;
					width?: string | undefined;
					height?: string | undefined;
					isAvailable?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					sizeName?: string | undefined;
					width?: string | undefined;
					height?: string | undefined;
					isAvailable?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					sizeName?: string | undefined;
					width?: string | undefined;
					height?: string | undefined;
					isAvailable?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					sizeName?: string | undefined;
					width?: string | undefined;
					height?: string | undefined;
					isAvailable?: boolean | undefined;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/schools": {
		$get: {
			input: {
				query: {
					query?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					query?: string | undefined;
				};
			};
			output: {
				success: true;
				data: {
					id: number;
					name: string;
					canChooseActivities: boolean;
					classes: {
						id: number;
						name: string;
					}[];
				}[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/schools": {
		$post: {
			input: {
				json: {
					name: string;
					canChooseActivities: boolean;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					name: string;
					canChooseActivities: boolean;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					name: string;
					canChooseActivities: boolean;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/roles": {
		$get: {
			input: {};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {};
			output: {
				success: true;
				data: {
					id: number;
					name: string;
					displayName: string;
				}[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/": {
		$get: {
			input: {};
			output: {
				name: string;
				version: string;
				authors: string[];
				docs?: string | undefined;
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/enrollments": {
		$get: {
			input: {
				query: {
					year: number;
					query?: string | undefined;
					weekId?: number | undefined;
					schoolId?: number | undefined;
					teamId?: number | undefined;
					classId?: number | undefined;
					page?: number | undefined;
					size?: number | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					year: number;
					query?: string | undefined;
					weekId?: number | undefined;
					schoolId?: number | undefined;
					teamId?: number | undefined;
					classId?: number | undefined;
					page?: number | undefined;
					size?: number | undefined;
				};
			};
			output: {
				success: true;
				data: {
					count: number;
					elements: {
						id: number;
						weeks: {
							weekId: number;
							isPaid: boolean;
						}[];
						user: {
							id: string;
							name: string;
							surname: string;
							gender: "M" | "F" | null;
						};
						dataProcessingConsent: boolean;
						imageProcessingConsent: boolean;
						exitAuthorization: boolean;
						section: string;
						specialDiet: string | null;
						school: {
							id: number;
							name: string;
						};
						team: {
							id: number;
							name: string;
							color: string;
						} | null;
						class: {
							id: number;
							name: string;
						};
					}[];
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/enrollments": {
		$post: {
			input: {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					managerNotes: string | null;
					queueId: number;
					teamId?: number | null | undefined;
					exitAuthorization?: boolean | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					managerNotes: string | null;
					queueId: number;
					teamId?: number | null | undefined;
					exitAuthorization?: boolean | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					managerNotes: string | null;
					queueId: number;
					teamId?: number | null | undefined;
					exitAuthorization?: boolean | null | undefined;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					managerNotes: string | null;
					queueId: number;
					teamId?: number | null | undefined;
					exitAuthorization?: boolean | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		};
	};
} & {
	"/enrollments/queue": {
		$post: {
			input: {
				json: {
					weeks: number[];
					user: string;
					dataProcessingConsent: boolean;
					imageProcessingConsent: boolean;
					classId: number;
					section: string;
					exitAuthorization?: boolean | undefined;
					parentNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					shirt?: number | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					weeks: number[];
					user: string;
					dataProcessingConsent: boolean;
					imageProcessingConsent: boolean;
					classId: number;
					section: string;
					exitAuthorization?: boolean | undefined;
					parentNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					shirt?: number | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					weeks: number[];
					user: string;
					dataProcessingConsent: boolean;
					imageProcessingConsent: boolean;
					classId: number;
					section: string;
					exitAuthorization?: boolean | undefined;
					parentNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					shirt?: number | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					weeks: number[];
					user: string;
					dataProcessingConsent: boolean;
					imageProcessingConsent: boolean;
					classId: number;
					section: string;
					exitAuthorization?: boolean | undefined;
					parentNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					shirt?: number | null | undefined;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				json: {
					weeks: number[];
					user: string;
					dataProcessingConsent: boolean;
					imageProcessingConsent: boolean;
					classId: number;
					section: string;
					exitAuthorization?: boolean | undefined;
					parentNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					shirt?: number | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 403;
		};
	};
} & {
	"/enrollments/queue": {
		$get: {
			input: {
				query: {
					year: number;
					query?: string | undefined;
					weekId?: number | undefined;
					schoolId?: number | undefined;
					classId?: number | undefined;
					page?: number | undefined;
					size?: number | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					year: number;
					query?: string | undefined;
					weekId?: number | undefined;
					schoolId?: number | undefined;
					classId?: number | undefined;
					page?: number | undefined;
					size?: number | undefined;
				};
			};
			output: {
				success: true;
				data: {
					count: number;
					elements: {
						id: number;
						weeks: {
							weekId: number;
						}[];
						user: {
							id: string;
							name: string;
							surname: string;
							gender: "M" | "F" | null;
						};
						dataProcessingConsent: boolean;
						imageProcessingConsent: boolean;
						exitAuthorization: boolean | null;
						section: string;
						parentNotes: string | null;
						specialDiet: string | null;
						school: {
							id: number;
							name: string;
						};
						class: {
							id: number;
							name: string;
						};
					}[];
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/enrollments/queue/:id": {
		$delete: {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/users/enrollments": {
		$get: {
			input: {
				query: {
					year: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					year: number;
				};
			};
			output: {
				success: true;
				data: {
					weeks: {
						weekId: number;
						isPaid: boolean | null;
					}[];
					status: "none" | "enrolled" | "pending";
					user: {
						id: string;
						name: string;
						surname: string;
						gender: "M" | "F" | null;
					};
					section: string | null;
					school: {
						id: number;
						name: string;
					} | null;
					class: {
						id: number;
						name: string;
					} | null;
				}[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/users/self/enrollments": {
		$get: {
			input: {
				query: {
					year: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					year: number;
				};
			};
			output: {
				success: true;
				data: {
					weeks: {
						weekId: number;
						isPaid: boolean | null;
					}[];
					status: "none" | "enrolled" | "pending";
					user: {
						id: string;
						name: string;
						surname: string;
						gender: "M" | "F" | null;
					};
					section: string | null;
					school: {
						id: number;
						name: string;
					} | null;
					class: {
						id: number;
						name: string;
					} | null;
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/enrollments/:id": {
		$get: {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: true;
				data: {
					id: number;
					weeks: {
						weekId: number;
						isPaid: boolean;
					}[];
					user: {
						id: string;
						name: string;
						surname: string;
						gender: "M" | "F" | null;
						birthDate: string | null;
						birthPlace: string | null;
					};
					dataProcessingConsent: boolean;
					imageProcessingConsent: boolean;
					exitAuthorization: boolean;
					section: string;
					year: number;
					parentNotes: string | null;
					managerNotes: string | null;
					specialDiet: string | null;
					school: {
						id: number;
						name: string;
					};
					team: {
						id: number;
						name: string;
						color: string;
					} | null;
					shirt: {
						id: number;
						sizeName: string;
					} | null;
					class: {
						id: number;
						name: string;
					};
					managers: {
						id: string;
						name: string;
						email: string | null;
						phone: string | null;
						surname: string;
						gender: "M" | "F" | null;
					}[];
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/enrollments/:id": {
		$put: {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					schoolId: number;
					dataProcessingConsent: boolean;
					exitAuthorization: boolean;
					classId: number;
					section: string;
					year: number;
					parentNotes?: string | null | undefined;
					managerNotes?: string | null | undefined;
					team?: number | null | undefined;
					shirt?: number | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					schoolId: number;
					dataProcessingConsent: boolean;
					exitAuthorization: boolean;
					classId: number;
					section: string;
					year: number;
					parentNotes?: string | null | undefined;
					managerNotes?: string | null | undefined;
					team?: number | null | undefined;
					shirt?: number | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					schoolId: number;
					dataProcessingConsent: boolean;
					exitAuthorization: boolean;
					classId: number;
					section: string;
					year: number;
					parentNotes?: string | null | undefined;
					managerNotes?: string | null | undefined;
					team?: number | null | undefined;
					shirt?: number | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					schoolId: number;
					dataProcessingConsent: boolean;
					exitAuthorization: boolean;
					classId: number;
					section: string;
					year: number;
					parentNotes?: string | null | undefined;
					managerNotes?: string | null | undefined;
					team?: number | null | undefined;
					shirt?: number | null | undefined;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/enrollments/:id": {
		$delete: {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/admin/enrollments": {
		$post: {
			input: {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					userId: string;
					dataProcessingConsent: boolean;
					classId: number;
					section: string;
					imageProcessingConsent?: boolean | undefined;
					exitAuthorization?: boolean | null | undefined;
					parentNotes?: string | null | undefined;
					managerNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					team?: number | null | undefined;
					shirt?: number | null | undefined;
					ignoreRestrictions?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					userId: string;
					dataProcessingConsent: boolean;
					classId: number;
					section: string;
					imageProcessingConsent?: boolean | undefined;
					exitAuthorization?: boolean | null | undefined;
					parentNotes?: string | null | undefined;
					managerNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					team?: number | null | undefined;
					shirt?: number | null | undefined;
					ignoreRestrictions?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					userId: string;
					dataProcessingConsent: boolean;
					classId: number;
					section: string;
					imageProcessingConsent?: boolean | undefined;
					exitAuthorization?: boolean | null | undefined;
					parentNotes?: string | null | undefined;
					managerNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					team?: number | null | undefined;
					shirt?: number | null | undefined;
					ignoreRestrictions?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					userId: string;
					dataProcessingConsent: boolean;
					classId: number;
					section: string;
					imageProcessingConsent?: boolean | undefined;
					exitAuthorization?: boolean | null | undefined;
					parentNotes?: string | null | undefined;
					managerNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					team?: number | null | undefined;
					shirt?: number | null | undefined;
					ignoreRestrictions?: boolean | undefined;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				json: {
					weeks: {
						id: number;
						isPaid: boolean;
					}[];
					userId: string;
					dataProcessingConsent: boolean;
					classId: number;
					section: string;
					imageProcessingConsent?: boolean | undefined;
					exitAuthorization?: boolean | null | undefined;
					parentNotes?: string | null | undefined;
					managerNotes?: string | null | undefined;
					specialDiet?: string | null | undefined;
					team?: number | null | undefined;
					shirt?: number | null | undefined;
					ignoreRestrictions?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 403;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/classes": {
		$get: {
			input: {
				query: {
					schoolId?: number | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					schoolId?: number | undefined;
				};
			};
			output: {
				success: true;
				data: {
					id: number;
					name: string;
					school: {
						id: number;
						name: string;
						canChooseActivities: boolean;
					};
				}[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/classes": {
		$post: {
			input: {
				json: {
					name: string;
					schoolId: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					name: string;
					schoolId: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					name: string;
					schoolId: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					name: string;
					schoolId: number;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/user/login": {
		$post: {
			input: {
				json: {
					password: string;
					username: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					password: string;
					username: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					password: string;
					username: string;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				json: {
					password: string;
					username: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 429;
		} | {
			input: {
				json: {
					password: string;
					username: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 401;
		};
	};
} & {
	"/user/register": {
		$post: {
			input: {
				json: {
					name: string;
					password: string;
					surname: string;
					cf: string;
					phoneNumber: string;
					email?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					surname: string;
					cf: string;
					phoneNumber: string;
					email?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					surname: string;
					cf: string;
					phoneNumber: string;
					email?: string | undefined;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		} | {
			input: {
				json: {
					name: string;
					password: string;
					surname: string;
					cf: string;
					phoneNumber: string;
					email?: string | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 403;
		};
	};
} & {
	"/user/logout": {
		$post: {
			input: {};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/attendances/grouped": {
		$get: {
			input: {
				query: {
					date: string;
				};
			};
			output: {
				success: true;
				data: {
					schools: {
						id: number;
						name: string;
						classes: {
							id: number;
							name: string;
							total: number;
						}[];
						total: number;
					}[];
					total: number;
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/attendances": {
		$get: {
			input: {
				query: {
					date: string;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					date: string;
				};
			};
			output: {
				success: true;
				data: {
					id: number;
					user: {
						id: string;
						name: string;
						surname: string;
					};
					enrollmentId: number;
					eatsInOratory: boolean;
				}[];
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/attendances/:id": {
		$delete: {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/attendances/:id": {
		$put: {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					date?: string | undefined;
					eatsInOratory?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					date?: string | undefined;
					eatsInOratory?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					date?: string | undefined;
					eatsInOratory?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 404;
		} | {
			input: {
				param: {
					id: number;
				};
			} & {
				json: {
					date?: string | undefined;
					eatsInOratory?: boolean | undefined;
				};
			};
			output: {
				success: true;
				data: null;
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/attendances": {
		$post: {
			input: {
				json: {
					date: string;
					userId: string;
					eatsInOratory?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					date: string;
					userId: string;
					eatsInOratory?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					date: string;
					userId: string;
					eatsInOratory?: boolean | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					date: string;
					userId: string;
					eatsInOratory?: boolean | undefined;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/"> & import("hono/types").MergeSchemaPath<{
	"/activities": {
		$get: {
			input: {
				query: {
					query?: string | undefined;
					schoolId?: number | undefined;
					classId?: number | undefined;
					page?: number | undefined;
					size?: number | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				query: {
					query?: string | undefined;
					schoolId?: number | undefined;
					classId?: number | undefined;
					page?: number | undefined;
					size?: number | undefined;
				};
			};
			output: {
				success: true;
				data: {
					count: number;
					elements: {
						id: number;
						name: string;
						place: string | null;
					}[];
				};
			};
			outputFormat: "json";
			status: 200;
		};
	};
} & {
	"/activities": {
		$post: {
			input: {
				json: {
					name: string;
					weeks: {
						weekId: number;
						startTime: string;
						endTime: string;
					}[];
					place?: string | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 400;
		} | {
			input: {
				json: {
					name: string;
					weeks: {
						weekId: number;
						startTime: string;
						endTime: string;
					}[];
					place?: string | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 409;
		} | {
			input: {
				json: {
					name: string;
					weeks: {
						weekId: number;
						startTime: string;
						endTime: string;
					}[];
					place?: string | null | undefined;
				};
			};
			output: {
				success: false;
				error: string;
			};
			outputFormat: "json";
			status: 500;
		} | {
			input: {
				json: {
					name: string;
					weeks: {
						weekId: number;
						startTime: string;
						endTime: string;
					}[];
					place?: string | null | undefined;
				};
			};
			output: {
				success: true;
				data: number;
			};
			outputFormat: "json";
			status: 200;
		};
	};
}, "/">, "/">;
type Schema = typeof v1Router extends OpenAPIHono<any, infer S, any> ? S : never;
export type ApiType = Hono<any, Schema, "/">;

export {};

