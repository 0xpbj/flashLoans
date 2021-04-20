import { Address, Bytes, ethereum, log } from '@graphprotocol/graph-ts';
import {
  Reserve,
  User,
  ContractToPoolMapping,
} from '../../generated/schema';
import { getReserveId } from '../utils/id-generation';

export function getPoolByContract(event: ethereum.Event): string {
  let contractAddress = event.address.toHexString();
  let contractToPoolMapping = ContractToPoolMapping.load(contractAddress);
  if (contractToPoolMapping === null) {
    // throw new Error(contractAddress + 'is not registered in ContractToPoolMapping');
    log.error('{} is not registered in ContractToPoolMapping', [contractAddress]);
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

export function getOrInitReserve(underlyingAsset: Address, event: ethereum.Event): Reserve {
  let poolId = getPoolByContract(event);
  let reserveId = getReserveId(underlyingAsset, poolId);
  let reserve = Reserve.load(reserveId);
  log.warning('{} something to cause redeploy', [])

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