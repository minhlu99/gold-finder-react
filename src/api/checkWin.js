import axiosClient from "./axiosClient"


const checkWinApi = {
  checkWin(id, openedGoldCells) {
    const url = '/checkWin'
    const payload = { id, openedGoldCells }
    return axiosClient.post(url, payload)
  }
}

export default checkWinApi
