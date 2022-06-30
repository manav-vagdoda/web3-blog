// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/// @title Blog Smart Contract (June 22, 2022)
/// @author Manav Vagdoda (vagdonic.github.io)

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Blog {
    string public name;
    address public owner;

    using Counters for Counters.Counter;
    Counters.Counter private _postIds;

    struct Post {
        uint id;
        string title;
        string content;
        bool published;
    }

    mapping(uint => Post) private idToPost;
    mapping(string => Post) private hashToPost;

    event PostCreated (uint id, string title, string hash);
    event PostUpdated (uint id, string title, string hash, bool published);

    constructor (string memory _name) {
        console.log("Deploying with name: ", _name);
        name = _name;
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function updateName (string memory _name) public {
        name = _name;
    }

    function transferOwnership (address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function fetchPost (string memory _hash) public view returns (Post memory) {
        return hashToPost[_hash];
    }

    function createPost (string memory _title, string memory _hash) public onlyOwner {
        _postIds.increment();
        uint postId = _postIds.current();
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = _title;
        post.content = _hash;
        post.published = true;
        hashToPost[_hash] = post;
        emit PostCreated(postId, _title, _hash);
    }

    function updatePost (uint _id, string memory _title, string memory _hash, bool _published) public onlyOwner {
        Post storage post = idToPost[_id];
        post.title = _title;
        post.content = _hash;
        post.published = _published;
        hashToPost[_hash] = post;
        idToPost[_id] = post;
        emit PostUpdated(_id, _title, _hash, _published);
    }

    function fetchPosts() public view returns (Post[] memory) {
        uint itemCount = _postIds.current();
        Post[] memory posts = new Post[](itemCount);

        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Post storage currentItem = idToPost[currentId];
            posts[i] = currentItem;
        }

        return posts;
    }

}
