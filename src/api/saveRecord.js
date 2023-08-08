import axiosClient from "./axiosClient"


const saveRecordApi = {
  saveRecord(recordData) {
    const url = '/saveRecord'
    const payload = recordData
    return axiosClient.post(url, payload)
  }
}

export default saveRecordApi
