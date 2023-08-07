import axiosClient from "./axiosClient"


const handleClickApi = {
  handleClick(id, rowIndex, cellIndex) {
    const url = '/handleClick'
    const payload = { id, rowIndex, cellIndex }
    return axiosClient.post(url, payload)
  }
}

export default handleClickApi
