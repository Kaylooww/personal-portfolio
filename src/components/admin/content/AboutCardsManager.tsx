"use client";

import { ContentIcon } from "@/components/ui/ContentIcon";
import { deleteListItem, moveListItem, setListItemVisibility } from "@/lib/actions/content";
import { ABOUT_CARD_KINDS } from "@/lib/validation/content";
import type { AboutCard, AboutCardKind } from "@/types";
import { InlineListManager } from "../InlineListManager";
import { AboutCardForm } from "./AboutCardForm";

const KIND_ICON: Record<AboutCardKind, string> = { education: "graduation", interests: "gamepad", focus: "code", location: "pin", goals: "target" };

export function AboutCardsManager({ cards }: { cards: AboutCard[] }) {
  return (
    <InlineListManager
      items={cards}
      listLabel="About cards"
      itemNoun="card"
      addLabel="+ Add card"
      empty={{ icon: "book", title: "The notice board is empty", message: "Add cards for education, interests, focus, location and goals." }}
      label={(c) => c.title}
      leading={(c) => (
        <span className="grid size-10 shrink-0 place-items-center rounded-control bg-active text-link">
          <ContentIcon icon={KIND_ICON[c.kind]} className="size-5" />
        </span>
      )}
      summary={(c) => `${ABOUT_CARD_KINDS.find((k) => k.value === c.kind)?.label ?? c.kind} · ${c.items.map((i) => i.label).join(", ")}`}
      renderForm={(p) => <AboutCardForm {...p} />}
      onMove={(id, dir) => moveListItem("about_cards", id, dir)}
      onVisibility={(id, v) => setListItemVisibility("about_cards", id, v)}
      onDelete={(id) => deleteListItem("about_cards", id)}
    />
  );
}
