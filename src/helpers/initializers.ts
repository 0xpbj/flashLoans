import { Address, Bytes, ethereum, log } from '@graphprotocol/graph-ts';
import {
  Reserve,
  User,
  ContractToPoolMapping,
} from '../../generated/schema';
import { getReserveId } from '../utils/id-generation';
import {
  // PRICE_ORACLE_ASSET_PLATFORM_SIMPLE,
  // PRICE_ORACLE_ASSET_TYPE_SIMPLE,
  // zeroAddress,
  // zeroBD,
  // zeroBI,
} from '../utils/converters';

export function getPoolByContract(event: ethereum.Event): string {
  let contractAddress = event.address.toHexString();
  let contractToPoolMapping = ContractToPoolMapping.load(contractAddress);
  if (contractToPoolMapping === null) {
    throw new Error(contractAddress + 'is not registered in ContractToPoolMapping');
  }
  return contractToPoolMapping.pool;
}

export function getOrInitUser(address: Address): User {
  let user = User.load(address.toHexString());
  if (!user) {
    user = new User(address.toHexString());
    user.borrowedReservesCount = 0;
    user.save();
  }
  return user as User;
}

export function getOrInitReserve(underlyingAsset: Address, event: ethereum.Event): Reserve {    // Was ret. Reserve
  let poolId = getPoolByContract(event);
  let reserveId = getReserveId(underlyingAsset, poolId);
  let reserve = Reserve.load(reserveId);

  if (reserve === null) {
    reserve = new Reserve(reserveId);
    reserve.underlyingAsset = underlyingAsset;
    reserve.pool = poolId;
    reserve.symbol = '';
    reserve.name = '';
    reserve.decimals = 0;
  }
  return reserve as Reserve;
}