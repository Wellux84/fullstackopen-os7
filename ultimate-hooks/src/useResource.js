import { useState, useEffect } from 'react'
import axios from 'axios'

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(baseUrl)
      setResources(response.data)
    }

    fetchData()
  }, [baseUrl])

  const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject)
    setResources(resources.concat(response.data))
  }

  return [resources, { create }]
}

export default useResource
