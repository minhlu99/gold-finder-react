import axiosClient from "./axiosClient"


const getLeaderBoardApi = {
  getLeaderBoard(level) {
    const url = '/getLeaderBoard'
    const payload = {level}
    return axiosClient.post(url, payload)
  }
}

export default getLeaderBoardApi
