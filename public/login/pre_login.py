import tkinter as tk
from tkinter import ttk
from tkinter import Canvas
from PIL import Image, ImageTk
import webbrowser

class Background(tk.Canvas):
    def __init__(self, master, image_path, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        self.image_path = image_path
        self.bind("<Configure>", self.resize_image)

    def resize_image(self, event):
        self.delete("all")
        image = Image.open(self.image_path)
        image = image.resize((event.width, event.height), Image.Resampling.LANCZOS)
        self.image = ImageTk.PhotoImage(image)
        self.create_image(0, 0, anchor="nw", image=self.image)
        self.create_welcome_text(event.width, event.height)

    def create_welcome_text(self, width, height):
        self.create_text(
            width // 18, height // 2,
            text="Welcome to DDH -\nDetection Assistive System",
            font=("Arial", 36, "bold"),
            fill="#4D5461",
            anchor="w",
            justify="left"
        )

class RoundedFrame(tk.Canvas):
    def __init__(self, master, bg_color="white", corner_radius=20, **kwargs):
        super().__init__(master, **kwargs)
        self.corner_radius = corner_radius
        self.bg_color = bg_color
        self.bind("<Configure>", self.draw_rounded_rectangle)

    def draw_rounded_rectangle(self, event):
        self.delete("all")
        width = self.winfo_width()
        height = self.winfo_height()
        self.create_rounded_rectangle(0, 0, width, height, self.corner_radius, fill=self.bg_color, outline="")

    def create_rounded_rectangle(self, x1, y1, x2, y2, radius, **kwargs):
        points = [
            x1+radius, y1,
            x2-radius, y1,
            x2, y1,
            x2, y1+radius,
            x2, y2-radius,
            x2, y2,
            x2-radius, y2,
            x1+radius, y2,
            x1, y2,
            x1, y2-radius,
            x1, y1+radius,
            x1, y1
        ]
        return self.create_polygon(points, **kwargs, smooth=True)

class LoginBlock(tk.Frame):
    def __init__(self, master, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        self.configure(bg="white", highlightbackground="black", highlightthickness=2, bd=10, relief="ridge")
        self.create_widgets()

    def create_widgets(self):
        login_label = tk.Label(self, text="Login", font=("Arial", 36, "bold"), bg="white")
        login_label.pack(pady=(20, 30))

        self.create_entry("Username", "👤")
        self.create_entry("Password", "🔒", show="*")

        remember_var = tk.BooleanVar()
        remember_check = ttk.Checkbutton(self, text="Remember me", variable=remember_var, style="TCheckbutton")
        remember_check.pack(anchor="w", pady=(10, 20))

        login_button = ttk.Button(self, text="Login", style="TButton", command=self.open_html_page)
        login_button.pack(fill="x", pady=(0, 20))

    def create_entry(self, placeholder, icon, show=None):
        frame = ttk.Frame(self)
        frame.pack(fill="x", pady=10)

        icon_label = tk.Label(frame, text=icon, font=("Arial", 24), bg="white")
        icon_label.pack(side="left", padx=(0, 10))

        entry = ttk.Entry(frame, font=("Arial", 18), show=show)
        entry.pack(fill="x")
        entry.insert(0, placeholder)

    def open_html_page(self):
        webbrowser.open(r"C:\Users\Ryan\Desktop\DDHDAS\public\main\main.html")  # 替換為你的HTML檔案的路徑

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("DDH - Detection Assistive System")
        self.geometry("1200x800")
        self.configure(bg="#333333")
        self.create_widgets()
        self.configure_style()

    def create_widgets(self):
        self.background = Background(self, r"C:\Users\Ryan\Desktop\DDHDAS\bg.png")
        self.background.place(x=0, y=0, relwidth=1, relheight=1)

        self.rounded_frame = RoundedFrame(self, bg_color="white", corner_radius=80, highlightthickness=0)
        self.rounded_frame.place(relx=0.75, rely=0.5, anchor="center", width=500, height=500)

        self.login_block = LoginBlock(self.rounded_frame)
        self.login_block.place(relx=0.5, rely=0.5, anchor="center", width=400)

    def configure_style(self):
        style = ttk.Style()
        style.configure("TButton", font=("Arial", 18), padding=15)
        style.configure("TEntry", padding=10)
        style.configure("TCheckbutton", background="white")

if __name__ == "__main__":
    app = App()
    app.mainloop()
