// fetch(`https://api.github.com/repos/${req.query.id}`)
import { useResources, useResource } from '../../src/index'

interface Repo {
  id: string
  name: string
  creatorId: number
  updatedAt: number
}

let counter = 3
const CustomRepos: Repo[] = [
  {
    id: '1',
    name: 'React',
    creatorId: 1,
    updatedAt: new Date().valueOf()
  },
  {
    id: '2',
    name: 'Angular',
    creatorId: 2,
    updatedAt: new Date().valueOf()
  }
]
const useRepos = () => {
  const response = useResources<Repo>({
    namespace: 'repos',
    fetchAll: (): Promise<Repo[]> => {
      return new Promise(resolve => {
        console.log('我在请求')
        setTimeout(() => {
          resolve(CustomRepos)
        }, 1500)
      })
    },
    create: () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            id: (counter++).toString(),
            name: 'Vue',
            updatedAt: new Date().valueOf(),
            creatorId: 1
          })
        }, 1500)
      })
    },
    delete: id => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true)
        }, 1500)
      })
    },
    update: data => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ ...data })
        }, 1500)
      })
    }
  })

  return response
}

const repoCreator = useResource<Repo>({
  namespace: 'repos',
  fetchById: (id: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(CustomRepos.find(_ => _.id === id))
      }, 1500)
    })
  },
  update: data => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ ...data })
      }, 1500)
    })
  }
})

export const useRepo = (id: string) => {
  return repoCreator(id)
}

export default useRepos
