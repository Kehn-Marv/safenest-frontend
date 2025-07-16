use aiken/list
use aiken/option
use cardano/address.{Address, KeyHash}
use cardano/script_context.{ScriptContext}
use cardano/transaction.{OutputReference, Transaction}

type EscrowDatum {
  buyer: Address,
  lawyer_confirmed: Address,
  inspector_confirmed: Address,
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
        expect
          list.any(
            tx.extra_signatories,
            fn(sig) {
              when datum.lawyer_confirmed.payment_credential is {
                KeyHash(hash) -> sig == hash
                _ -> false
              }
            },
          )

        true
      }
      ConfirmByInspector -> {
        expect
          list.any(tx.signatories, fn(sig) { sig == datum.inspector_confirmed })
        true
      }
      ReleaseFunds -> {
        expect list.any(tx.signatories, fn(sig) { sig == datum.buyer })
        true
      }
    }
  }

  else(_) {
    fail
  }
}
