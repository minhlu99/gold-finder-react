import axiosClient from "./axiosClient"


const challengePlayerApi = {
  challengePlayer(id) {
    const url = '/challengePlayer'
    const payload = { id }
    return axiosClient.post(url, payload)
  }
}

export default challengePlayerApi
