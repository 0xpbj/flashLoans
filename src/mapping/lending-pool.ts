import {
  FlashLoan
} from '../../generated/templates/LendingPool/LendingPool';
import {
  getOrInitReserve,
  getOrInitUser,
} from '../helpers/initializers';
import {
  FlashLoan as FlashLoanAction,
} from '../../generated/schema';
import { EventTypeRef, getHistoryId } from '../utils/id-generation';

export function handleFlashLoan(event: FlashLoan): void {
  let initiator = getOrInitUser(event.params.initiator);
  let poolReserve = getOrInitReserve(event.params.asset, event);
  if (!poolReserve) {
    // console.log('handleFlashLoan:  failed to getOrInitReserve. Returning.')
    return
  }

  let premium = event.params.premium;

  // poolReserve.availableLiquidity = poolReserve.availableLiquidity.plus(premium);

  // poolReserve.lifetimeFlashLoans = poolReserve.lifetimeFlashLoans.plus(event.params.amount);
  // poolReserve.lifetimeFlashLoanPremium = poolReserve.lifetimeFlashLoanPremium.plus(premium);
  // poolReserve.totalATokenSupply = poolReserve.totalATokenSupply.plus(premium);

  poolReserve.save();

  let flashLoan = new FlashLoanAction(getHistoryId(event, EventTypeRef.FlashLoan));
  flashLoan.pool = poolReserve.pool;
  flashLoan.reserve = poolReserve.id;
  flashLoan.target = event.params.target;
  flashLoan.initiator = initiator.id;
  flashLoan.totalFee = premium;
  flashLoan.amount = event.params.amount;
  flashLoan.timestamp = event.block.timestamp.toI32();
  flashLoan.save();
}