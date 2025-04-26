import { Octokit } from 'octokit'

const octokit: InstanceType<typeof Octokit> = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export default octokit
