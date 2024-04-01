import axios from "axios";

export interface HttpResponseError {
	error: {
		status: number | null;
		message: string;
		data: any;
	};
}

export class HttpClientError extends Error {
	constructor(message: string, public status: number | null, public data: any) {
		super(message);
		this.status = status;
		this.data = data;
	}
}

const handleHttpClientError = (error: unknown) => {
	let failedResponse: HttpResponseError = {
		error: {
			status: null,
			message: "Error desconocido",
			data: null,
		},
	};

	if (axios.isAxiosError(error)) {
		failedResponse.error = {
			status: error.response?.status ?? null,
			message: error.message,
			data: error.response?.data,
		};
	}

	return failedResponse;
	
};

export const httpClient = {
	get: async <T = any>(url: string, config: any = {}) => {
		try {
			const { data } = await axios.get<T>(url, config);

			return data;
		} catch (error) {

			const failedResponse = handleHttpClientError(error);

			throw new HttpClientError(failedResponse.error.message, failedResponse.error.status, failedResponse.error.data);
		}
	},
	post: async <T = any>(url: string, body: any, config: any = {}) => {
		try {
			const { data } = await axios.post<T>(url, body, config);

			return data;
		} catch (error) {

			const failedResponse = handleHttpClientError(error);

			throw new HttpClientError(failedResponse.error.message, failedResponse.error.status, failedResponse.error.data);
		}
	},
};
