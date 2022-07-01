from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory, send_file
from pdf2docx import Converter
from docx2pdf import convert
from pdf2jpg import pdf2jpg
from pdf2image import convert_from_path
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_apscheduler import APScheduler
import sys
import img2pdf
from PIL import Image
import aspose.words as aw
import pdf_compressor
from compressF import compress
from pyPdf import PdfFileWriter, PdfFileReader

# set Flask scheduler configuration values
class Config:
    SCHEDULER_API_ENABLED = True
    SCHEDULER_TIMEZONE = "Europe/Berlin"


app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.db') 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '@pdftools'
db = SQLAlchemy(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
DOWNLOAD_FOLDER = 'downloads/'
app.config['DOWNLOAD_FOLDER'] = DOWNLOAD_FOLDER



# tasks model 
class Tasks(db.Model):
    id = db.Column(db.Integer, unique=True, primary_key=True,autoincrement=True)
    folder=db.Column(db.String(255))
    filename = db.Column(db.String(255))
    time_added = db.Column(db.String(255))
    

    def __init__(self,folder, filename, time_added ):
        self.folder = folder
        self.filename  = filename 
        self.time_added = time_added

    def __repr__(self):
        return '<Task %r>' % self.filename 

# flask scheduler
app.config.from_object(Config())
# initialize scheduler
scheduler = APScheduler()
# if you don't wanna use a config, you can set options here:
# scheduler.api_enabled = True
scheduler.init_app(app)

# Scheduler for sending mails to inform user about their bids
@scheduler.task('interval', id='do_job_1', seconds=120, misfire_grace_time=9)
def job1():    
    tasks = Tasks.query.all()
    for i in tasks:
        print(i.id)
        try:
            os.remove(os.path.join(DOWNLOAD_FOLDER)+i.filename)
            os.remove(os.path.join(UPLOAD_FOLDER)+i.filename)
        except Exception as e:
            print(str(e))
        db.session.delete (i)
        db.session.commit() 
        print("deleted!")
# scheduler.start()

@app.route("/")
def index():
    return render_template("index.html")
    
@app.route('/download/<string:filename>')
def download(filename):
    print(filename)
    document_path = os.path.join(DOWNLOAD_FOLDER)+filename
    try:
        file = open(document_path, 'r')
    except:
        file= None
    if file:
        assign_task_to_remove_file(filename=filename)
        return send_file(os.path.join(DOWNLOAD_FOLDER)+filename, attachment_filename=filename)
    else:
        return "File Expired!"

def assign_task_to_remove_file(filename):
    # os.path.join(DOWNLOAD_FOLDER)
    # os.remove(os.path.join(DOWNLOAD_FOLDER)+filename)
    task = Tasks(folder="downloads",filename=filename,time_added=datetime.strptime(datetime.now().strftime('%Y-%m-%d %H'), '%Y-%m-%d %H') )
    db.session.add(task)
    db.session.commit() 
    print(filename," assigned task to for deleting!")


@app.route("/pdf-to-doc",methods=['GET','POST'])
def pdf_to_doc():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        pdf_file = "uploads/"+filename
        filename2 = filename.replace(".pdf",".docx")
        docx_file = "downloads/"+filename2

        # convert pdf to docx
        cv = Converter(pdf_file)
        cv.convert(docx_file)     
        cv.close()
        response = "/download/"+filename2
        return response

    return render_template("pdf-to-doc-converter.html")

@app.route("/doc-to-pdf",methods=['GET','POST'])
def doc_to_pdf():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        print("filename is: ",filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        # doc_file = "uploads/"+filename
        filename2 = filename.replace(".docx",".pdf")
        # pdf_file = "downloads/"+filename2
        docx_file = 'Facebook.docx'
        pdf_file = 'Facebook.pdf'
        convert(docx_file, pdf_file)



        # response = "download/"+filename2
        # return response
        print('done')
        

    return render_template("doc-to-pdf-converter.html")


@app.route("/pdf-to-jpg",methods=['GET','POST'])
def pdf_to_jpg():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save((os.path.join(UPLOAD_FOLDER, filename)))
        pages = convert_from_path(os.path.join(UPLOAD_FOLDER, filename), 500)
        
        filename2 = filename.replace(".pdf",".jpg")
    
        for page in pages:
            page.save(os.path.join(DOWNLOAD_FOLDER,filename2), 'JPEG')
        
        response = "/download/"+filename2
        return response

    return render_template("pdf-to-jpg-converter.html")

@app.route("/jpg-to-pdf",methods=['GET','POST'])
def jpg_to_pdf():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save((os.path.join(UPLOAD_FOLDER, filename)))

        filename2 = filename.replace(".jpg",".pdf")
        # storing image path
        img_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # storing pdf path
        pdf_path = os.path.join(DOWNLOAD_FOLDER, filename2)
        # opening image
        image = Image.open(img_path)
        # converting into chunks using img2pdf
        pdf_bytes = img2pdf.convert(image.filename)
        
        # opening or creating pdf file
        file = open(pdf_path, "wb")
        
        # writing pdf files with chunks
        file.write(pdf_bytes)
        
        # closing image file
        image.close()
        
        # closing pdf file
        file.close()
        
        response = "/download/"+filename2
        return response

    return render_template("jpg-to-pdf-converter.html")

@app.route("/pdf-to-png",methods=['GET','POST'])
def pdf_to_png():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save((os.path.join(UPLOAD_FOLDER, filename)))
        pages = convert_from_path(os.path.join(UPLOAD_FOLDER, filename), 500)
        
        filename2 = filename.replace(".pdf",".png")
    
        for page in pages:
            page.save(os.path.join(DOWNLOAD_FOLDER,filename2), 'PNG')
        
        response = "/download/"+filename2
        return response

    return render_template("pdf-to-png-converter.html")

@app.route("/png-to-pdf",methods=['GET','POST'])
def png_to_pdf():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save((os.path.join(UPLOAD_FOLDER, filename)))  
        doc = aw.Document()
        builder = aw.DocumentBuilder(doc)

        builder.insert_image("uploads/"+filename)

        filename2 = filename.replace(".png",".pdf")

        doc.save("downloads/"+filename2)     
        
        response = "/download/"+filename2
        return response

    return render_template("png-to-pdf-converter.html")

@app.route("/pdf-compressor",methods=['GET','POST'])
def pdf_compressor():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save((os.path.join(UPLOAD_FOLDER, filename)))  
        compress("uploads/"+filename,"downloads/"+filename)
        
        response = "/download/"+filename
        return response

@app.route("/crop-pdf",methods=['GET','POST'])
def crop_pdf():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save((os.path.join(UPLOAD_FOLDER, filename)))  


        
        with open("uploads/"+filename, "rb") as in_f:
            input1 = PdfFileReader(in_f)
            output = PdfFileWriter()

            numPages = input1.getNumPages()
            # print "document has %s pages." % numPages

            for i in range(numPages):
                page = input1.getPage(i)
                # print page.mediaBox.getUpperRight_x(), page.mediaBox.getUpperRight_y()
                page.trimBox.lowerLeft = (25, 25)
                page.trimBox.upperRight = (225, 225)
                page.cropBox.lowerLeft = (50, 50)
                page.cropBox.upperRight = (200, 200)
                output.addPage(page)
            with open("downloads/"+filename, "wb") as out_f:
                output.write(out_f)
        
        response = "/download/"+filename
        return response

    return render_template("crop-pdf.html")

@app.route("/rotate-pdf",methods=['GET','POST'])
def rotate_pdf():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save((os.path.join(UPLOAD_FOLDER, filename)))  

        response = "/download/"+filename
        return response

    return render_template("rotate-pdf.html")

@app.route("/unlock-pdf",methods=['GET','POST'])
def unlock_pdf():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save((os.path.join(UPLOAD_FOLDER, filename)))  

        response = "/download/"+filename
        return response

    return render_template("unlock-pdf.html")

@app.route("/combine-pdf",methods=['GET','POST'])
def combine_pdf():
    if request.method == "POST":
        file = request.files['fileList[]']
        filename = secure_filename(file.filename)
        file.save((os.path.join(UPLOAD_FOLDER, filename)))  

        response = "/download/"+filename
        return response

    return render_template("combine-pdf.html")





if __name__=='__main__':
    app.run(debug=True,use_reloader=False)