interface UserData {
  firstName: string
  lastName: string
  age: number
  gender: string
  hair: {
    color: string
  }
  address: {
    postalCode: string
  }
  company: {
    department: string
  }
}

interface DepartmentSummary {
  male: number
  female: number
  ageRange: string
  hair: {
    [color: string]: number
  }
  addressUser: {
    [fullName: string]: string
  }
}

export interface SummaryData {
  [department: string]: DepartmentSummary
}

interface DuplicateNumber {
  [department: string]: {
    [fullName: string]: number
  }
}

export function convertDataByDepartment(userList: UserData[]): SummaryData {
  const dataByDep: SummaryData = {}
  const duplicateNumber: DuplicateNumber = {}
  for (const user of userList) {
    if (user?.company?.department) {
      const userDepartment = user?.company?.department
      if (!dataByDep[userDepartment]) {
        dataByDep[userDepartment] = { male: 0, female: 0, ageRange: '0-0', hair: {}, addressUser: {} }
        duplicateNumber[userDepartment] = {}
      }

      const dataDep = dataByDep[userDepartment]
      if (user?.gender === 'male') dataDep.male += 1
      else if (user?.gender === 'female') dataDep.female += 1

      if (user?.age) {
        const [minS, maxS] = dataDep.ageRange.split('-')
        let min = Number(minS)
        let max = Number(maxS)
        if (user.age < min || min === 0) min = user.age
        if (user.age > max || max === 0) max = user.age
        dataDep.ageRange = `${min}-${max}`
      }

      const userHairColor = user?.hair?.color
      if (userHairColor) {
        if (!dataDep.hair[userHairColor]) dataDep.hair[userHairColor] = 0
        dataDep.hair[userHairColor]++
      }

      if (user?.firstName) {
        const fullName = `${user.firstName}${user.lastName}`
        if (!dataDep.addressUser[fullName]) dataDep.addressUser[fullName] = user?.address?.postalCode
        else {
          // If full name duplicate add _[number] after last name
          if (!duplicateNumber[userDepartment][fullName]) duplicateNumber[userDepartment][fullName] = 0
          duplicateNumber[userDepartment][fullName]++
          dataDep.addressUser[`${fullName}_${duplicateNumber[userDepartment][fullName] + 1}`] =
            user?.address?.postalCode
        }
      }
    }
  }

  return dataByDep
}
