export interface SlugProgramLike {
  school: string
  major: string
  year: number
}

export function buildProgramSlug(program: SlugProgramLike) {
  return `${program.school}-${program.major}-${program.year}`
}
