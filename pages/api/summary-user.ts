import { SummaryData, convertDataByDepartment } from '@components/utils/common/helper'
import type { NextApiRequest, NextApiResponse } from 'next'

interface userResponseData {
  users: []
  total: number
  skip: number
  limit: number
}

interface ResponseData {
  code: string
  data?: SummaryData | null
  message?: string
}

export default async function handler(_: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const resp = await fetch('https://dummyjson.com/users')
  try {
    const uData: userResponseData = await resp.json()
    if (!Array.isArray(uData.users)) {
      response({ res, status: 500, code: 'error_invalid', message: 'Incorrect data from https://dummyjson.com/users' })
      return
    }

    const newData = convertDataByDepartment(uData.users)
    response({ res, code: 'success', data: newData })
  } catch (error) {
    response({ res, status: 500, code: 'error_fetch', message: "Can't get data from https://dummyjson.com/users" })
  }
}

function response({
  res,
  status = 200,
  code,
  message = '',
  data,
}: {
  res: NextApiResponse<ResponseData>
  status?: number
  code: string
  message?: string
  data?: SummaryData
}) {
  res.status(status).json({ code, message, data })
}
