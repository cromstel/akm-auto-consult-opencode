'use client';
import { useState } from 'react';

export function StaffInviteForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('claims_officer');
  const [scope, setScope] = useState('branch');

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); alert('Invite submitted — server-side provisioning required (M2 auth not fully wired).'); }}
      className="space-y-3"
      aria-label="Staff invitation form"
    >
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          type="email"
          required
          aria-label="Invite email"
          className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          placeholder="staff@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Role
        <select
          aria-label="Invite role"
          className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>claims_officer</option>
          <option>adjuster</option>
          <option>inspector</option>
          <option>finance</option>
          <option>auditor</option>
          <option>support</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Scope
        <select
          aria-label="Invite scope"
          className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option>branch</option>
          <option>assigned</option>
          <option>global</option>
        </select>
      </label>
      <button
        type="submit"
        aria-label="Send staff invitation"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Send invitation
      </button>
    </form>
  );
}

export function AuditQueryForm() {
  const [actor, setActor] = useState('');
  const [action, setAction] = useState('role_change');

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); alert('Audit query submitted — server-side audit service required (M2 auth not fully wired).'); }}
      className="flex flex-wrap gap-3 items-end"
      aria-label="Audit query form"
    >
      <label className="flex flex-col gap-1 text-sm">
        Actor
        <input aria-label="Audit actor" type="text" className="rounded-md border border-border bg-card px-3 py-2 text-sm" placeholder="user-id or email" value={actor} onChange={(e) => setActor(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Action
        <select aria-label="Audit action" className="rounded-md border border-border bg-card px-3 py-2 text-sm" value={action} onChange={(e) => setAction(e.target.value)}>
          <option>role_change</option>
          <option>staff_invite</option>
          <option>access_review</option>
          <option>retention_update</option>
        </select>
      </label>
      <button type="submit" aria-label="Search audit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Search</button>
    </form>
  );
}