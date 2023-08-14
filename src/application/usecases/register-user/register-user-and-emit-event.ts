import { IEncrypterProvider } from '@application/adapters/providers/encrypter';
import { IEventProvider } from '@application/adapters/providers/event';
import { IUniqueIDGeneratorProvider } from '@application/adapters/providers/unique-id-generator';
import { IUserRepository } from '@application/adapters/repositories/user';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { UserCreatedEvent, UserCreatedEventPayload } from '@application/events/user-created';
import { User } from '@entities/user';
import { failure, success } from '@shared/either';
import { IRegisterUser } from './register-user';

export class RegisterUserAndEmitEvent implements IRegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypterProvider,
    private readonly uniqueIDGenerator: IUniqueIDGeneratorProvider,
    private readonly eventProvider: IEventProvider
  ) {}

  async register({ email, password }: IRegisterUser.Params): IRegisterUser.Result {
    const userEmailAlreadyRegistered = await this.userRepository.findOneByEmail(email);

    if (userEmailAlreadyRegistered) {
      return failure(new UserAlreadyRegisteredError());
    }

    const encrypterRes = this.encrypter.encrypt(password.value);

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

    this.eventProvider.emit<UserCreatedEventPayload>(userCreatedEvent);

    return success(user);
  }
}
