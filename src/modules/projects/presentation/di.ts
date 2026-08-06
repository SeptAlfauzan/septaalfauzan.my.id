import { HttpProjectDataSource } from '../data/http-data-source'
import { MockProjectDataSource } from '../data/mock-data-source'
import { ProjectRepositoryImpl } from '../domain/project.repository'
import { GetProjectByIdUseCase } from '../domain/use-cases/get-project-by-id.use-case'
import { GetProjectsUseCase } from '../domain/use-cases/get-projects.use-case'

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true'
const dataSource = useMockApi ? new MockProjectDataSource() : new HttpProjectDataSource()
const repository = new ProjectRepositoryImpl(dataSource)

export const getProjectsUseCase = new GetProjectsUseCase(repository)
export const getProjectByIdUseCase = new GetProjectByIdUseCase(repository)
