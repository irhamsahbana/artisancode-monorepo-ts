import * as Entity from '@/entities/project.entity'

export interface IProjectRepo {
  create(req: Entity.CreateProjectReq): Promise<Entity.Project>
  findById(id: string): Promise<Entity.Project | null>
  findList(req: Entity.GetProjectReq): Promise<Entity.ProjectList>
  findMapMarkers(): Promise<Entity.ProjectMapMarker[]>
  update(req: Entity.UpdateProjectReq): Promise<Entity.Project | null>
  delete(id: string): Promise<void>
  createVisit(req: Entity.CreateProjectVisitReq): Promise<Entity.ProjectVisit>
  findVisitsByProjectId(projectId: string): Promise<Entity.ProjectVisit[]>
  findAllVisits(): Promise<Entity.ProjectVisit[]>
  findProjectsByNumbers(numbers: string[]): Promise<Entity.Project[]>
  findProjectsByNamesAndCustomers(
    items: { customerId: string; name: string }[],
  ): Promise<Entity.Project[]>
}

export interface IProjectUsecase {
  create(req: Entity.CreateProjectReq): Promise<Entity.Project>
  findById(id: string): Promise<Entity.Project>
  findList(req: Entity.GetProjectReq): Promise<Entity.ProjectList>
  findMapMarkers(): Promise<Entity.ProjectMapMarker[]>
  update(req: Entity.UpdateProjectReq): Promise<Entity.Project>
  delete(id: string): Promise<void>
  createVisit(req: Entity.CreateProjectVisitReq): Promise<Entity.ProjectVisit>
  findVisitsByProjectId(projectId: string): Promise<Entity.ProjectVisit[]>
  findAllVisits(): Promise<Entity.ProjectVisit[]>
  generateTemplate(): Promise<Buffer>
  dryRunImport(fileBuffer: Buffer | Uint8Array): Promise<Entity.ProjectImportDryRunResult>
  executeImport(req: Entity.ProjectImportExecuteReq): Promise<Entity.ProjectImportExecuteResult>
}
