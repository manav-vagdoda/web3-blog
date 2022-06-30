const { expect } = require('chai')
const { ethers } = require('hardhat')
const { isCallTrace } = require('hardhat/internal/hardhat-network/stack-traces/message-trace')

describe("Blog", function () {
  it("Should create a post", async function () {
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("Web3 Blog")
    await blog.deployed()
    await blog.createPost("My first post", "12345")

    const posts = await blog.fetchPosts()
    expect(posts[0].title).to.equal("My first post")
  })

  it("Should update the name", async function() {
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("Web3 Blog")
    await blog.deployed()
    
    expect(await blog.name()).to.equal("Web3 Blog")
    await blog.updateName("My updated web3 blog")
    expect(await blog.name()).to.equal("My updated web3 blog")
  })

  it("Should update a post", async function() {
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("Web3 Blog")
    await blog.deployed()

    await blog.createPost("My post", "34567")

    await blog.updatePost(1, "My updated post", "34567", true)

    const posts = await blog.fetchPosts()
    expect(posts[0].title).to.equal("My updated post")
  })
})