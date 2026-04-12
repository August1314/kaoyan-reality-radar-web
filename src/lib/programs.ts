import { programs } from '../data/programs'
import { buildProgramSlug } from './programSlug'

export function findProgramBySlug(slug: string) {
  return programs.find((program) => buildProgramSlug(program) === decodeURIComponent(slug)) ?? null
}

export function findProgramById(id: string) {
  return programs.find((program) => program.id === id) ?? null
}
