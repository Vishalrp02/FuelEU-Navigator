/**
 * PoolMembersList Component
 * Display list of pool members with their CB values
 */

import type { PoolMember } from '../../../../core/domain/compliance';

interface PoolMembersListProps {
  members: PoolMember[];
  selectedMembers: PoolMember[];
  onToggleMember: (shipId: string) => void;
  loading: boolean;
}

export const PoolMembersList = ({
  members,
  selectedMembers,
  onToggleMember,
  loading,
}: PoolMembersListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading pool members...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No pool members available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map(member => {
        const isSelected = selectedMembers.some(m => m.shipId === member.shipId);
        const isDeficit = member.adjustedCB < 0;
        return (
          <label
            key={member.shipId}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleMember(member.shipId)}
              className="h-4 w-4 rounded border-border"
            />
            <div className="flex-1">
              <p className="font-medium text-foreground">{member.shipId}</p>
              <p className={`text-sm ${isDeficit ? 'text-error' : 'text-success'}`}>
                {isDeficit ? 'Deficit: ' : 'Surplus: '}{member.adjustedCB}
              </p>
            </div>
            <div className={`rounded-full px-3 py-1 text-sm font-medium ${
              isDeficit
                ? 'bg-error/10 text-error'
                : 'bg-success/10 text-success'
            }`}>
              {member.adjustedCB}
            </div>
          </label>
        );
      })}
    </div>
  );
};
