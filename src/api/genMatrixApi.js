import axiosClient from "./axiosClient"


const genMatrixApi = {
  getMatrix(rows) {
    const url = '/genMatrix'
    const payload = { rows: rows }
    return axiosClient.post(url, payload)
  }
}

export default genMatrixApi
