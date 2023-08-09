import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'https://api-gold-finder.techwiz.tech',
  headers: {
    'Content-Type': 'application/json'
  },
})

export default axiosClient