import { IEncrypterProvider } from '@application/adapters/providers/encrypter';
import { IUniqueIDGeneratorProvider } from '@application/adapters/providers/unique-id-generator';
import { IUserRepository } from '@application/adapters/repositories/user';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { User } from '@entities/user';
import { failure, success } from '@utils/either';
import { IRegisterUser } from './register-user';
import { IEventEmitter } from '@application/adapters/providers/event-emitter';
import { UserCreatedEvent, UserCreatedEventPayload } from '@domain/events/user-created';

export class RegisterUserAndEmitEvent implements IRegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypterProvider,
    private readonly uniqueIDGenerator: IUniqueIDGeneratorProvider,
    private readonly eventEmitter: IEventEmitter
  ) {}

  async register({ email, password }: IRegisterUser.Params): IRegisterUser.Result {
    const userEmailAlreadyRegistered = await this.userRepository.findOneByEmail(email);

    if (userEmailAlreadyRegistered) {
      return failure(new UserAlreadyRegisteredError());
    }

    const encrypterRes = this.encrypter.encryptUserPassword(password);

    if (encrypterRes.isFailure()) {
      return failure(encrypterRes.value);
    }

    const userId = this.uniqueIDGenerator.generate();

    const createUserRes = User.create({
      id: userId,
      hashedPassword: encrypterRes.value,
      email: email,
      emailValidated: false,
    });

    if (createUserRes.isFailure()) {
      return failure(createUserRes.value);
    }

    const user = createUserRes.value;

    const saveRes = await this.userRepository.save(user);

    if (saveRes.isFailure()) {
      return failure(saveRes.value);
    }

    const userCreatedEvent = new UserCreatedEvent({ user });

    this.eventEmitter.emit<UserCreatedEventPayload>(userCreatedEvent);

    return success(user);
  }
}
