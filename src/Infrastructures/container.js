const { createContainer } = require("instances-container");

// external agency
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const Jwt = require("@hapi/jwt"); // [WAJIB ADA]
const pool = require("./database/postgres/pool");

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const ThreadRepositoryPostgres = require("./repository/ThreadRepositoryPostgres");
const CommentRepositoryPostgres = require("./repository/CommentRepositoryPostgres");
const AuthenticationRepositoryPostgres = require("./repository/AuthenticationRepositoryPostgres"); // [WAJIB ADA]
const BcryptPasswordHash = require("./security/BcryptPasswordHash");
const JwtTokenManager = require("./security/JwtTokenManager"); // [WAJIB ADA]

// import use case
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const AddThreadUseCase = require("../Applications/use_case/AddThreadUseCase");
const GetThreadDetailUseCase = require("../Applications/use_case/GetThreadDetailUseCase");
const AddCommentUseCase = require("../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../Applications/use_case/DeleteCommentUseCase");
const LoginUserUseCase = require("../Applications/use_case/LoginUserUseCase"); // [WAJIB ADA]
const LogoutUserUseCase = require("../Applications/use_case/LogoutUserUseCase"); // [WAJIB ADA]
const RefreshAuthenticationUseCase = require("../Applications/use_case/RefreshAuthenticationUseCase"); // [WAJIB ADA]

// import domain interfaces
const UserRepository = require("../Domains/users/UserRepository");
const PasswordHash = require("../Applications/security/PasswordHash");
const ThreadRepository = require("../Domains/threads/ThreadRepository");
const CommentRepository = require("../Domains/comments/CommentRepository");
const AuthenticationRepository = require("../Domains/authentications/AuthenticationRepository"); // [WAJIB ADA]
const AuthenticationTokenManager = require("../Applications/security/AuthenticationTokenManager"); // [WAJIB ADA]

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: AuthenticationRepository.name, // [WAJIB ADA]
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [{ concrete: bcrypt }],
    },
  },
  {
    key: AuthenticationTokenManager.name, // [WAJIB ADA]
    Class: JwtTokenManager,
    parameter: {
      dependencies: [{ concrete: Jwt.token }],
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
        { name: "userRepository", internal: UserRepository.name },
        { name: "passwordHash", internal: PasswordHash.name },
      ],
    },
  },
  {
    key: LoginUserUseCase.name, // [WAJIB ADA]
    Class: LoginUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "userRepository", internal: UserRepository.name },
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
        { name: "passwordHash", internal: PasswordHash.name },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name, // [WAJIB ADA]
    Class: LogoutUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name, // [WAJIB ADA]
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
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
        { name: "threadRepository", internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: GetThreadDetailUseCase.name,
    Class: GetThreadDetailUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: ThreadRepository.name },
        { name: "commentRepository", internal: CommentRepository.name },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "commentRepository", internal: CommentRepository.name },
        { name: "threadRepository", internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "commentRepository", internal: CommentRepository.name },
        { name: "threadRepository", internal: ThreadRepository.name },
      ],
    },
  },
]);

module.exports = container;
