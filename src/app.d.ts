// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	interface Locals {
		user: User,
		user_id: string | undefined,
		startTimer: number;
		logger: any;
		error: string | undefined;
		errorId: string | undefined;
		errorStackTrace: string | undefined;
		surreal: any;
	}
	interface Error {
		code?: string;
		errorId?: string;
	}
	// interface PageData {}
	// interface Platform {}
}
