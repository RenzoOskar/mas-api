export interface IAppointmentDTO {
  scheduleId: number;
  insuredId: string;
  countryISO: string;
  status: string;
}

export interface IQueryListResponse {
  data: IAppointmentDTO[];
}