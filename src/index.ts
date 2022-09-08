import { CanvasRenderingContext2D, Window } from "skia-canvas";
import store from "./store";

abstract class SkiaComponent {

  /**
   * This runs after element's render.
   * Lets user define "side-effect" logic when component finishes rendering
   */
  componentDidMount() {}
  
  /**
   * This runs after element's render.
   * Lets user define "side-effect" logic when component finishes rendering
   */
  componentDidUpdate() {}
  
  /**
   * This runs when element is queued for destruction next tick. 
   * Lets user define logic when component leaves scene.
   */
  componentWillUnmount() {}

  /**
   * The render lifecyle. Draw to context here.
   */
  render(ctx: CanvasRenderingContext2D) {}
}

class SkiaElement extends SkiaComponent {
  /**
   * Has element been created and rendered at least once?
   */
  mounted = false;
  /**
   * Is the element visible?
   */
  visible = true;
  /**
   * Is the element queued for destruction?
   */
  destroyFlag = false;

  afterRender() {
    // Mounting logic
    if(!this.mounted) {
      this.mounted = true;
      this.componentDidMount();
    }

    this.componentDidUpdate();
  }

  /**
   * Toggle the visibility of this element
   * @param visibility Visibility of element
   */
  setVisible(visibility: boolean) {
    this.visible = visibility;
  }

  /**
   * Marks the element for "destruction"
   * This means this class will be removed from scene graph next frame tick
   */
  destroy() {
    // Call the unmount method 
    this.componentWillUnmount();
    this.destroyFlag = true;
  }
}

const COLORS = [
  'orange', 'yellow', 'green', 'skyblue', 'purple', 'teal', 'magenta'
]

class Button extends SkiaElement { 
  x = 0;
  y = 0;
  lifecycle = 0;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  render(ctx: CanvasRenderingContext2D) {
    
    ctx.beginPath()
    // const colorKey = Math.round(Math.random() * COLORS.length -1);
    const colorKey = this.x % COLORS.length - 1;
    ctx.fillStyle = COLORS[colorKey]
    // ctx.arc(this.x, this.y, 10 + 30 * Math.random(), 0, 2 * Math.PI)
    const random = this.x % 3;
    ctx.arc(this.x, this.y, 10 + 30 * random, 0, 2 * Math.PI)
    ctx.fill()

    this.lifecycle += 1;
    if(this.lifecycle > 30) {
      console.log('[BUTTON] Button lifecycle ended')
      this.destroy();
    }
  }
  onClick() {
    console.log('button clicked')
  }
}

const sceneGraph = {
  children: [new Button(0,0)],
}

let win = new Window(800, 800,{background:'rgba(16, 16, 16, 0.35)'});
win.title = "Canvas Window";
win.on("draw", (e) => {
  let ctx = e.target.canvas.getContext("2d");

  // Destroy any elements flagged
  sceneGraph.children = sceneGraph.children.filter((child) => !child.destroyFlag)

  // Render all elements
  //@ts-ignore
  sceneGraph.children.forEach((child) => {
    if(!child.visible) return;
    child.render(ctx);
    child.afterRender();
  })

  // We can also use Zustand store to manage state directly
  // const { bears } = store.getState()
  // new Array(bears).fill(0).map((_, index) => {
  //   ctx.beginPath();
  //   ctx.arc(10 * index, 10 * index, 10, 0, 2 * Math.PI);
  //   ctx.stroke();
  //   ctx.fill();
  // })
});

win.on('mousemove', ({button, x, y, target, ctrlKey, altKey, shiftKey, metaKey, pageX, pageY, ...rest}) => {
  let ctx = target.canvas.getContext("2d");
  // const { canvas, ctx } = win;

  // Left click
  if (!shiftKey && button == 0){ 
    console.log('left click!', pageX, pageY)

    // Zustand example
    // const { bears, increase } = store.getState()
    // increase(1);
    // console.log('bears', bears)

    // When user clicks, add new element where user clicked
    sceneGraph.children = [...sceneGraph.children, new Button(x, y)]
  }

  // Shift and left click!
  if(shiftKey && button == 0) {
    console.log('shift left click!')

  }

  // Middle click
  if (button == 1){ 
    console.log('middle click!')
  }

  // Right click
  if (button == 2){ 
    console.log('right click!')
  }

  win.cursor = button === 0 ? 'none' : 'crosshair'
})

win.on('keydown', ({key, target}) => {
  let ctx = target.canvas.getContext("2d");
  // const { canvas, ctx } = win;
  if (key == 'Escape'){
    // ctx.clearRect(0, 0, target.canvas.width, target.canvas.height)

    // Close window
    target.close()
  }
})