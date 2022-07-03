component Appearance
  ch: char
  fg: str
  bg: str
end

component OldPosition
  x: int
  y: int
end

component Position
  x: int
  y: int
end

component MoveAction
  x: int
  y: int
end

tag IsPlayer

template Player
  IsPlayer
  Appearance('@', "white", "black")
end

system onKey(e: entity, IsPlayer, k: KeyEvent)
  e.add(match k.key
    "up"    = MoveAction( 0, -1)
    "right" = MoveAction( 1,  0)
    "down"  = MoveAction( 0,  1)
    "left"  = MoveAction(-1,  0)
  end)
end

system movement(e: entity, p: Position, m: MoveAction)
  e.add(OldPosition(p.x, p.y))
  p.x += m.x
  p.y += m.y
  e.remove(m)
end

system drawAfterMove(e: entity, a: Appearance,
            o: OldPosition, p: Position)
  draw(o.x, o.y, ' ')

  e.remove(o)
  draw(p.x, p.y, a.ch, a.fg, a.bg)
end

fn main()
  setSize(80, 50)
  spawn(Player,
    Position(40, 25),
    ; this is to make sure that draw() is called
    OldPosition(40, 25)
  )
  pushKeyHandler(onKey)
end
