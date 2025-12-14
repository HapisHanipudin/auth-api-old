const { createContainer } = require("instances-container");

// external agency
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const pool = require("./database/postgres/pool");

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const ThreadRepositoryPostgres = require("./repository/ThreadRepositoryPostgres");
const CommentRepositoryPostgres = require("./repository/CommentRepositoryPostgres");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");

// import use case
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const UserRepository = require("../Domains/users/UserRepository");
const PasswordHash = require("../Applications/security/PasswordHash");
const AddThreadUseCase = require("../Applications/use_case/AddThreadUseCase");
const GetThreadDetailUseCase = require("../Applications/use_case/GetThreadDetailUseCase");
const ThreadRepository = require("../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../Applications/use_case/DeleteCommentUseCase");
const CommentRepository = require("../Domains/comments/CommentRepository");

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: GetThreadDetailUseCase.name,
    Class: GetThreadDetailUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
