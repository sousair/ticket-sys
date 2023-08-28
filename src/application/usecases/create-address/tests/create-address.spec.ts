import { IFindByPostalCodeRepository } from '@application/adapters/repositories/postal-code/find-by';
import { ICreateAddress } from '../create-address';
import { CreateAddress } from '../create-address-impl';
import { PostalCode } from '@entities/postal-code';
import { IPostalCodeInquiryProvider } from '@application/adapters/providers/postal-code-inquiry';
import { Failure, Success, failure, success } from '@shared/either';
import { PostalCodeNotFoundError } from '@application/errors/postal-code-not-found';
import { InternalError } from '@application/errors/internal-error';
import { IUniqueIDGeneratorProvider } from '@application/adapters/providers/unique-id-generator';
import { ISavePostalCodeRepository } from '@application/adapters/repositories/postal-code/save';
import { InvalidPostalCodeError } from '@domain/errors/invalid-postal-code';
import { ISaveAddressRepository } from '@application/adapters/repositories/address/save';
import { Address } from '@entities/address';
import { InvalidAddressError } from '@domain/errors/invalid-address';

describe('CreateAddress UseCase', () => {
  let sut: CreateAddress;

  let postalCodeRepository: IFindByPostalCodeRepository & ISavePostalCodeRepository;
  let postalCodeInquiryProvider: IPostalCodeInquiryProvider;
  let uniqueIDGeneratorProvider: IUniqueIDGeneratorProvider;
  let addressRepository: ISaveAddressRepository;

  let validParams: ICreateAddress.Params;

  const mockedPostalCode: PostalCode = {
    id: 'validId',
    postalCode: 'validPostalCode',
    street: 'validStreet',
    city: 'validCity',
    state: 'validState',
    country: 'validCountry',
  };

  beforeEach(() => {
    class PostalCodeRepositoryStub implements IFindByPostalCodeRepository, ISavePostalCodeRepository {
      async save(): ISavePostalCodeRepository.Result {
        return success(1);
      }
      async findBy(): IFindByPostalCodeRepository.Result {
        return mockedPostalCode;
      }
    }

    class PostalCodeInquiryProviderStub implements IPostalCodeInquiryProvider {
      async execute(): IPostalCodeInquiryProvider.Result {
        return success({
          postalCode: 'validPostalCode',
          street: 'validStreet',
          city: 'validCity',
          state: 'validState',
          country: 'validCountry',
        });
      }
    }

    class UniqueIDGeneratorProviderStub implements IUniqueIDGeneratorProvider {
      generate(): string {
        return 'validId';
      }
    }

    class AddressRepositoryStub implements ISaveAddressRepository {
      async save(): ISaveAddressRepository.Result {
        return success(1);
      }
    }

    postalCodeRepository = new PostalCodeRepositoryStub();
    postalCodeInquiryProvider = new PostalCodeInquiryProviderStub();
    uniqueIDGeneratorProvider = new UniqueIDGeneratorProviderStub();
    addressRepository = new AddressRepositoryStub();

    sut = new CreateAddress(postalCodeRepository, postalCodeInquiryProvider, uniqueIDGeneratorProvider, addressRepository);

    validParams = {
      country: 'country',
      postalCode: 'postalCode',
      number: 'number',
      addressLine: 'addressLine',
    };
  });

  it('should call PostalCodeRepository.findBy with correct values', async () => {
    const postalCodeRepositorySpy = jest.spyOn(postalCodeRepository, 'findBy');

    await sut.create(validParams);

    expect(postalCodeRepositorySpy).toHaveBeenCalledTimes(1);
    expect(postalCodeRepositorySpy).toHaveBeenCalledWith({
      postalCode: validParams.postalCode,
    });
  });

  describe('PostalCodeRepository.findBy returns null', () => {
    beforeEach(() => {
      jest.spyOn(postalCodeRepository, 'findBy').mockResolvedValueOnce(null);
    });

    it('should call PostalCodeInquiryProvider with correct values', async () => {
      const postalCodeInquiryProviderSpy = jest.spyOn(postalCodeInquiryProvider, 'execute');

      await sut.create(validParams);

      expect(postalCodeInquiryProviderSpy).toHaveBeenCalledTimes(1);
      expect(postalCodeInquiryProviderSpy).toHaveBeenCalledWith({
        postalCode: validParams.postalCode,
        country: validParams.country,
      });
    });

    it('should return Failure and PostalCodeNotFoundError if PostalCodeInquiryProvider returns Failure and PostalCodeNotFoundError', async () => {
      jest.spyOn(postalCodeInquiryProvider, 'execute').mockResolvedValueOnce(failure(new PostalCodeNotFoundError(validParams.postalCode)));

      const result = await sut.create(validParams);

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(PostalCodeNotFoundError);
    });

    it('should return Failure and InternalError if PostalCodeInquiryProvider returns Failure and InternalError', async () => {
      jest.spyOn(postalCodeInquiryProvider, 'execute').mockResolvedValueOnce(failure(new InternalError('anyMessage')));

      const result = await sut.create(validParams);

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(Error);
    });

    describe('PostalCodeInquiryProvider returns Success', () => {
      it('should call UniqueIDGeneratorProvider and PostalCode.create with correct values', async () => {
        const uniqueIDGeneratorProviderSpy = jest.spyOn(uniqueIDGeneratorProvider, 'generate');
        const postalCodeCreateSpy = jest.spyOn(PostalCode, 'create');

        await sut.create(validParams);

        expect(uniqueIDGeneratorProviderSpy).toHaveBeenCalledTimes(2);
        expect(postalCodeCreateSpy).toHaveBeenCalledTimes(1);
        expect(postalCodeCreateSpy).toHaveBeenCalledWith({
          id: 'validId',
          postalCode: 'postalCode',
          street: 'validStreet',
          city: 'validCity',
          state: 'validState',
          country: 'validCountry',
        });
      });

      it('should return Failure and InvalidPostalCode when PostalCode.create returns Failure and InvalidPostalCode', async () => {
        jest.spyOn(PostalCode, 'create').mockReturnValueOnce(failure(new InvalidPostalCodeError()));

        const result = await sut.create(validParams);

        expect(result).toBeInstanceOf(Failure);
        expect(result.value).toBeInstanceOf(InvalidPostalCodeError);
      });

      it('should call PostalCodeRepository.save with correct values', async () => {
        const postalCodeRepositorySpy = jest.spyOn(postalCodeRepository, 'save');

        await sut.create(validParams);

        expect(postalCodeRepositorySpy).toHaveBeenCalledTimes(1);
        expect(postalCodeRepositorySpy).toHaveBeenCalledWith({
          id: 'validId',
          postalCode: 'postalCode',
          street: 'validStreet',
          city: 'validCity',
          state: 'validState',
          country: 'validCountry',
        });
      });

      it('should return Failure and InternalError when PostalCodeRepository.save returns Failure and InternalError', async () => {
        jest.spyOn(postalCodeRepository, 'save').mockResolvedValueOnce(failure(new InternalError('anyMessage')));

        const result = await sut.create(validParams);

        expect(result).toBeInstanceOf(Failure);
        expect(result.value).toBeInstanceOf(InternalError);
      });
    });
  });

  it('should call Address.create with correct values', async () => {
    const addressCreateSpy = jest.spyOn(Address, 'create');

    await sut.create(validParams);

    expect(addressCreateSpy).toHaveBeenCalledTimes(1);
    expect(addressCreateSpy).toHaveBeenCalledWith({
      id: 'validId',
      number: 'number',
      addressLine: 'addressLine',
      postalCode: mockedPostalCode,
    });
  });

  it('should return Failure and InvalidAddressError when Address.create returns Failure and InvalidAddressError', async () => {
    jest.spyOn(Address, 'create').mockReturnValueOnce(failure(new InvalidAddressError()));

    const result = await sut.create(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InvalidAddressError);
  });

  it('should call AddressRepository.save with correct values', async () => {
    const addressRepositorySpy = jest.spyOn(addressRepository, 'save');

    await sut.create(validParams);

    expect(addressRepositorySpy).toHaveBeenCalledTimes(1);
    expect(addressRepositorySpy).toHaveBeenCalledWith({
      id: 'validId',
      number: 'number',
      addressLine: 'addressLine',
      postalCode: mockedPostalCode,
    });
  });

  it('should return Failure and InternalError when AddressRepository.save returns Failure and InternalError', async () => {
    jest.spyOn(addressRepository, 'save').mockResolvedValueOnce(failure(new InternalError('anyMessage')));

    const result = await sut.create(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });

  it('should return Success and Address when AddressRepository.save returns Success', async () => {
    const result = await sut.create(validParams);

    expect(result).toBeInstanceOf(Success);
    expect(result.value).toBeInstanceOf(Address);
  });
});
