import { HttpProjectDataSource } from '../data/http-data-source'
import { MockProjectDataSource } from '../data/mock-data-source'
import { ProjectRepositoryImpl } from '../domain/project.repository'
import { GetProjectByIdUseCase } from '../domain/use-cases/get-project-by-id.use-case'
import { GetProjectsUseCase } from '../domain/use-cases/get-projects.use-case'

const useHttpApi = import.meta.env.VITE_USE_HTTP_API === 'true'
const dataSource = useHttpApi ? new HttpProjectDataSource() : new MockProjectDataSource()
const repository = new ProjectRepositoryImpl(dataSource)

export const getProjectsUseCase = new GetProjectsUseCase(repository)
export const getProjectByIdUseCase = new GetProjectByIdUseCase(repository)
