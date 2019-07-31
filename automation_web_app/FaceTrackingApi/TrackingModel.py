from TrackingImage import TrackingImage

import cv2
import tensorflow as tf
import numpy      as np

import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

class TrackingModel : 
    def __init__(self):
        self.meta_graph_path        = 'C:/users/graye/Desktop/new_resnet/yolo.ckpt.meta'
        self.ckpt_path              = 'C:/users/graye/Desktop/new_resnet/yolo.ckpt'
        self.output_tensor_name     = 'training_vars/final_output:0'
        self.input_tensor_name      = 'input_image:0'
        self.train_placeholder_name = 'kp:0'

        self.model_input      = tf.placeholder(tf.float32, (None, 224, 224, 3))
        self.sess             = None
        self.out              = None
        self.onFrameProcessed = None

        self.startSession()

    def startSession(self):
        self.sess = tf.Session()

        saver = tf.train.import_meta_graph(self.meta_graph_path)
        saver.restore(self.sess, self.ckpt_path)
        graph = tf.get_default_graph()
    
        self.out = graph.get_tensor_by_name(self.output_tensor_name)

    def infer(self, image):
        data = image.convertData()

        if data is None:
            return

        image_input = cv2.resize(data, (224, 224))
        image_input = np.reshape(image_input, (1, 224,224,3))

        encoding = self.sess.run(self.out, feed_dict = { self.input_tensor_name : image_input, self.train_placeholder_name : False })
        
        image.parseEncoding(encoding[0])
        
        if self.onFrameProcessed is not None:
            self.onFrameProcessed(image)