use aiken/list
use aiken/option
// Escrow Validator for SafeNest
// Refactored for clarity and best practices

use cardano/address.{Address, KeyHash}
use cardano/script_context.{ScriptContext}
use cardano/transaction.{OutputReference, Transaction}

// Datum holds the key parties' addresses
// lawyer and inspector are the addresses of the respective professionals
// buyer is the address of the property buyer

type EscrowDatum {
  buyer: Address,
  lawyer: Address,
  inspector: Address,
}

type EscrowRedeemer {
  ConfirmByLawyer
  ConfirmByInspector
  ReleaseFunds
}

validator escrow {
  spend(
    datum_opt: Option<EscrowDatum>,
    redeemer: EscrowRedeemer,
    _input: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum_opt

    when redeemer is {
      ConfirmByLawyer -> {
        // Check if any extra signatory matches the lawyer's key hash
        expect
          list.any(
            tx.extra_signatories,
            fn(sig) {
              when datum.lawyer.payment_credential is {
                KeyHash(hash) -> sig == hash
                _ -> false
              }
            },
          )
        true
      }
      ConfirmByInspector -> {
        // Check if any signatory matches the inspector's key hash
        expect
          list.any(
            tx.signatories,
            fn(sig) {
              when datum.inspector.payment_credential is {
                KeyHash(hash) -> sig == hash
                _ -> false
              }
            },
          )
        true
      }
      ReleaseFunds -> {
        // Check if any signatory matches the buyer's key hash
        expect
          list.any(
            tx.signatories,
            fn(sig) {
              when datum.buyer.payment_credential is {
                KeyHash(hash) -> sig == hash
                _ -> false
              }
            },
          )
        true
      }
    }
  }

  else(_) {
    fail
  }
}
