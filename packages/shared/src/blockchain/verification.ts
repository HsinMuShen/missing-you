export type ChainVerificationState =
  | 'skipped_no_anchor'
  | 'skipped_no_metadata'
  | 'skipped_no_rpc'
  | 'missing_on_chain'
  | 'hash_mismatch'
  | 'verified';

export type ChainVerificationResult = {
  state: ChainVerificationState;
  message?: string;
  onChainOwner?: string;
  onChainContentHash?: string;
  onChainAnchoredAt?: number;
};
